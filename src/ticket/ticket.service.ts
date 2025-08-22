import { Injectable } from '@nestjs/common';
import { TicketRepository } from './ticket.repository';
import { ReserveTicketsDto } from './dtos/req/reserve-tickets.dto';
import { UpdateTicketDto } from './dtos/req/update-ticket.dto';
import { TicketResponseDto } from './dtos/res/ticket.response.dto';
import { TicketsListResponseDto } from './dtos/res/tickets-list.response.dto';
import { TicketAvailabilityResponseDto } from './dtos/res/ticket-availability.response.dto';
import { ReserveTicketsResponseDto } from './dtos/res/reserve-tickets.response.dto';
import { TicketNotFoundException } from './exceptions/ticket-not-found.exception';
import { TicketNotAvailableException } from './exceptions/ticket-not-available.exception';
import { InsufficientTicketsException } from './exceptions/insufficient-tickets.exception';
import { TicketOperationFailedException } from './exceptions/ticket-operation-failed.exception';
import { InvalidTicketDataException } from './exceptions/invalid-ticket-data.exception';
import { EventNotFoundException } from '../event/exceptions/event-not-found.exception';
import { TicketMapper } from '../utils/mappers/ticket.mapper';
import { ITicketService } from './interfaces/ticket-service.interface';
import { EventRepository } from '../event/event.repository';

@Injectable()
export class TicketService implements ITicketService {
    constructor(
        private readonly ticketRepository: TicketRepository,
        private readonly eventRepository: EventRepository,
    ) {}

    async getTicketsByEvent(eventId: number): Promise<TicketsListResponseDto> {
        // Verify event exists
        const event = await this.eventRepository.findEventById(eventId);
        if (!event) {
            throw new EventNotFoundException(eventId);
        }

        const tickets = await this.ticketRepository.getTicketsByEvent(eventId);
        return TicketMapper.mapToTicketsListResponseDto(tickets, eventId);
    }

    async getTicketsByTicketClass(ticketClassId: number): Promise<TicketsListResponseDto> {
        const tickets = await this.ticketRepository.getTicketsByTicketClass(ticketClassId);
        return TicketMapper.mapToTicketsListResponseDto(tickets, undefined, ticketClassId);
    }

    async getTicketById(id: number): Promise<TicketResponseDto> {
        const ticket = await this.ticketRepository.getTicketById(id);
        if (!ticket) {
            throw new TicketNotFoundException(id);
        }
        return TicketMapper.mapToTicketResponseDto(ticket);
    }

    async getTicketAvailabilityByEvent(eventId: number): Promise<TicketAvailabilityResponseDto> {
        // Verify event exists
        const event = await this.eventRepository.findEventById(eventId);
        if (!event) {
            throw new EventNotFoundException(eventId);
        }

        const ticketClassesWithCounts = await this.ticketRepository.getTicketAvailabilityByEvent(eventId);
        return TicketMapper.mapToTicketAvailabilityResponseDto(event, ticketClassesWithCounts);
    }

    async reserveTickets(reserveTicketsDto: ReserveTicketsDto): Promise<ReserveTicketsResponseDto> {
        try {
            // Validate input
            if (reserveTicketsDto.quantity <= 0) {
                throw new InvalidTicketDataException('quantity', 'Quantity must be greater than 0');
            }

            // Verify event exists
            const event = await this.eventRepository.findEventById(reserveTicketsDto.eventId);
            if (!event) {
                throw new EventNotFoundException(reserveTicketsDto.eventId);
            }

            // Check if event is in the future
            if (new Date(event.date) <= new Date()) {
                throw new TicketNotAvailableException('Cannot reserve tickets for past events');
            }

            // Check availability first
            const availableTickets = await this.ticketRepository.getAvailableTicketsByTicketClass(
                reserveTicketsDto.ticketClassId
            );

            if (availableTickets.length < reserveTicketsDto.quantity) {
                throw new InsufficientTicketsException(reserveTicketsDto.quantity, availableTickets.length);
            }

            // Reserve the tickets
            const reservedTickets = await this.ticketRepository.reserveTickets(reserveTicketsDto);

            // Set expiration time (15 minutes from now for MVP)
            const expiresAt = new Date();
            expiresAt.setMinutes(expiresAt.getMinutes() + 15);

            return TicketMapper.mapToReserveTicketsResponseDto(
                reservedTickets,
                reserveTicketsDto.eventId,
                reserveTicketsDto.ticketClassId,
                expiresAt
            );

        } catch (error) {
            if (error instanceof EventNotFoundException || 
                error instanceof InvalidTicketDataException ||
                error instanceof TicketNotAvailableException ||
                error instanceof InsufficientTicketsException) {
                throw error;
            }

            // Handle database or other errors
            const message = error.message || 'Unknown error occurred';
            throw new TicketOperationFailedException('reservation', message);
        }
    }

    async updateTicket(id: number, updateTicketDto: UpdateTicketDto): Promise<TicketResponseDto> {
        try {
            // Check if ticket exists
            const existingTicket = await this.ticketRepository.getTicketById(id);
            if (!existingTicket) {
                throw new TicketNotFoundException(id);
            }

            const updatedTicket = await this.ticketRepository.updateTicket(id, updateTicketDto);
            return TicketMapper.mapToTicketResponseDto(updatedTicket);

        } catch (error) {
            if (error instanceof TicketNotFoundException) {
                throw error;
            }

            // Handle database or other errors
            const message = error.message || 'Unknown error occurred';
            throw new TicketOperationFailedException('update', message);
        }
    }

    async releaseExpiredReservations(): Promise<void> {
        try {
            // Release reservations older than 15 minutes
            const fifteenMinutesAgo = new Date();
            fifteenMinutesAgo.setMinutes(fifteenMinutesAgo.getMinutes() - 15);

            // Get all events and release expired reservations
            const events = await this.eventRepository.getEvents();
            
            for (const event of events) {
                await this.ticketRepository.releaseReservedTickets(event.id, fifteenMinutesAgo);
            }

        } catch (error) {
            // Log error but don't throw - this is typically called by a scheduled job
            console.error('Failed to release expired reservations:', error.message);
        }
    }
}
