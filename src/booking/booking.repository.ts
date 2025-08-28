import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Booking, BookingStatus } from '@prisma/client';
import { CreateBookingDto } from './dtos/req/create-booking.dto';
import { UpdateBookingDto } from './dtos/req/update-booking.dto';
import { IBookingRepository } from './interfaces/booking-repository.interface';

@Injectable()
export class BookingRepository implements IBookingRepository {
    constructor(private readonly prisma: PrismaService) {}

    async createBooking(userId: number, paymentId?: string): Promise<Booking> {
        return this.prisma.booking.create({
            data: {
                userId: userId,
                paymentId,
                status: BookingStatus.PENDING,
            },
        });
    }

    async getBookingById(id: number): Promise<Booking | null> {
        return this.prisma.booking.findUnique({
            where: { id },
        });
    }

    async getBookingsByUserId(userId: number): Promise<Booking[]> {
        return this.prisma.booking.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }

    async getBookingByPaymentId(paymentId: string): Promise<Booking | null> {
        return this.prisma.booking.findUnique({
            where: { paymentId }
        });
    }

    async updateBooking(id: number, updateBookingDto: UpdateBookingDto): Promise<Booking> {
        return this.prisma.booking.update({
            where: { id },
            data: updateBookingDto,
        });
    }

    async updateBookingByPaymentId(paymentId: string, updateBookingDto: UpdateBookingDto): Promise<Booking> {
        return this.prisma.booking.update({
            where: { paymentId },
            data: updateBookingDto,
        });
    }

    async cancelBooking(id: number): Promise<Booking> {
        return this.prisma.booking.update({
            where: { id },
            data: { 
                status: BookingStatus.CANCELLED,
                updatedAt: new Date(),
            },
        });
    }

    async cancelBookingByPaymentId(paymentId: string): Promise<Booking> {
        return this.prisma.booking.update({
            where: { paymentId },
            data: { 
                status: BookingStatus.CANCELLED,
                updatedAt: new Date(),
            },
        });
    }

    async confirmBooking(id: number): Promise<Booking> {
        return this.prisma.booking.update({
            where: { id },
            data: { 
                status: BookingStatus.CONFIRMED,
                updatedAt: new Date(),
            },
        });
    }

    async confirmBookingByPaymentId(paymentId: string): Promise<Booking> {
        return this.prisma.booking.update({
            where: { paymentId },
            data: { 
                status: BookingStatus.CONFIRMED,
                updatedAt: new Date(),
            },
        });
    }

    async getBookingWithTickets(id: number): Promise<any> {
        return this.prisma.booking.findUnique({
            where: { id },
            include: {
                tickets: {
                    include: {
                        ticketClass: true,
                        event: true,
                    },
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
    }

    async getPendingBookings(): Promise<Booking[]> {
        return this.prisma.booking.findMany({
            where: { 
                status: BookingStatus.PENDING,
                createdAt: {
                    lt: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
                },
            },
            include: {
                tickets: true,
            },
        });
    }

    async updateTicketsBookingId(ticketIds: number[], bookingId: number): Promise<void> {
        await this.prisma.ticket.updateMany({
            where: {
                id: { in: ticketIds },
            },
            data: {
                bookingId,
            },
        });
    }

    async releaseTicketsFromBooking(bookingId: number): Promise<void> {
        await this.prisma.ticket.updateMany({
            where: {
                bookingId,
            },
            data: {
                bookingId: null,
                status: 'AVAILABLE' as any,
            },
        });
    }

    async updateBookingStatus(id: number, status: string): Promise<Booking> {
        return this.prisma.booking.update({
            where: { id },
            data: { 
                status: status as BookingStatus,
                updatedAt: new Date(),
            },
        });
    }

    async getBookingByOrderId(paymentId: string): Promise<any> {
        return this.prisma.booking.findUnique({
            where: { paymentId },
            include: {
                tickets: {
                    include: {
                        ticketClass: true,
                        event: true,
                    },
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
    }
    
}
