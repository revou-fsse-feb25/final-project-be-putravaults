import { Injectable } from '@nestjs/common';
import { ReserveTicketsDto } from './dtos/req/reserve-tickets.dto';
import { UpdateTicketDto } from './dtos/req/update-ticket.dto';
import { PrismaService } from 'prisma/prisma.service';
import { ITicketRepository } from './interfaces/ticket-repository.interface';

@Injectable()
export class TicketRepository implements ITicketRepository {
    constructor(private readonly prisma: PrismaService) {}

    async getTicketsByEvent(eventId: number) {
        return await this.prisma.ticket.findMany({
            where: { eventId },
            include: {
                ticketClass: true,
                event: {
                    select: {
                        id: true,
                        name: true,
                        date: true,
                        location: true,
                    }
                }
            },
            orderBy: [
                { ticketClass: { price: 'asc' } },
                { seatNumber: 'asc' },
            ],
        });
    }

    async getTicketsByTicketClass(ticketClassId: number) {
        return await this.prisma.ticket.findMany({
            where: { ticketClassId },
            include: {
                ticketClass: true,
                event: {
                    select: {
                        id: true,
                        name: true,
                        date: true,
                        location: true,
                    }
                }
            },
            orderBy: [
                { seatNumber: 'asc' },
            ],
        });
    }

    async getAvailableTicketsByTicketClass(ticketClassId: number) {
        return await this.prisma.ticket.findMany({
            where: { 
                ticketClassId,
                status: 'AVAILABLE',
            },
            include: {
                ticketClass: true,
                event: {
                    select: {
                        id: true,
                        name: true,
                        date: true,
                        location: true,
                    }
                }
            },
            orderBy: [
                { seatNumber: 'asc' },
            ],
        });
    }

    async getTicketById(id: number) {
        return await this.prisma.ticket.findUnique({
            where: { id },
            include: {
                ticketClass: true,
                event: {
                    select: {
                        id: true,
                        name: true,
                        date: true,
                        location: true,
                    }
                }
            },
        });
    }

    async getTicketAvailabilityByEvent(eventId: number) {
        // Get all ticket classes for the event with their counts
        const ticketClasses = await this.prisma.ticketClass.findMany({
            where: { eventId },
            include: {
                _count: {
                    select: {
                        tickets: {
                            where: { status: 'SOLD' }
                        }
                    }
                }
            }
        });

        // Get reserved counts separately
        const reservedCounts = await this.prisma.ticket.groupBy({
            by: ['ticketClassId'],
            where: {
                eventId,
                status: 'RESERVED',
            },
            _count: {
                id: true,
            },
        });

        // Combine the data
        return ticketClasses.map(ticketClass => ({
            ticketClass,
            counts: {
                soldCount: ticketClass._count.tickets,
                reservedCount: reservedCounts.find(rc => rc.ticketClassId === ticketClass.id)?._count.id || 0,
            }
        }));
    }

    async reserveTickets(reserveTicketsDto: ReserveTicketsDto) {
        const { eventId, ticketClassId, quantity, seatNumbers } = reserveTicketsDto;

        // Get available tickets
        const availableTickets = await this.getAvailableTicketsByTicketClass(ticketClassId);
        
        if (availableTickets.length < quantity) {
            throw new Error(`Insufficient tickets. Available: ${availableTickets.length}, Requested: ${quantity}`);
        }

        // Select tickets to reserve
        let ticketsToReserve = availableTickets.slice(0, quantity);

        // If specific seat numbers are requested, try to get those
        if (seatNumbers && seatNumbers.length > 0) {
            const specificSeats = availableTickets.filter(ticket => 
                ticket.seatNumber && seatNumbers.includes(ticket.seatNumber)
            );
            
            if (specificSeats.length === quantity) {
                ticketsToReserve = specificSeats;
            } else {
                throw new Error('Requested seat numbers are not available');
            }
        }

        // Reserve the tickets using transaction
        return await this.prisma.$transaction(async (tx) => {
            const reservedTickets: any[] = [];
            
            for (const ticket of ticketsToReserve) {
                const updated = await tx.ticket.update({
                    where: { 
                        id: ticket.id,
                        status: 'AVAILABLE', // Ensure it's still available
                    },
                    data: { status: 'RESERVED' },
                    include: {
                        ticketClass: true,
                        event: {
                            select: {
                                id: true,
                                name: true,
                                date: true,
                                location: true,
                            }
                        }
                    },
                });
                reservedTickets.push(updated);
            }

            return reservedTickets;
        });
    }

    async updateTicket(id: number, updateTicketDto: UpdateTicketDto) {
        return await this.prisma.ticket.update({
            where: { id },
            data: {
                ...(updateTicketDto.status && { status: updateTicketDto.status }),
                ...(updateTicketDto.seatNumber !== undefined && { seatNumber: updateTicketDto.seatNumber }),
            },
            include: {
                ticketClass: true,
                event: {
                    select: {
                        id: true,
                        name: true,
                        date: true,
                        location: true,
                    }
                }
            },
        });
    }

    async updateTicketsStatus(ticketIds: number[], status: 'AVAILABLE' | 'SOLD' | 'RESERVED'): Promise<void> {
        await this.prisma.ticket.updateMany({
            where: {
                id: { in: ticketIds },
            },
            data: { status },
        });
    }

    async assignTicketsToBooking(ticketIds: number[], bookingId: number): Promise<void> {
        await this.prisma.ticket.updateMany({
            where: {
                id: { in: ticketIds },
            },
            data: { 
                bookingId,
                status: 'SOLD',
            },
        });
    }

    async releaseReservedTickets(eventId: number, olderThan: Date): Promise<void> {
        // Note: This is a simplified version. In a real system, you'd track reservation timestamps
        await this.prisma.ticket.updateMany({
            where: {
                eventId,
                status: 'RESERVED',
                // In a real system, you'd have a reservedAt timestamp to compare with olderThan
            },
            data: { 
                status: 'AVAILABLE',
                bookingId: null,
            },
        });
    }
}
