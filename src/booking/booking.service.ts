import { Injectable } from '@nestjs/common';
import { BookingRepository } from './booking.repository';
import { TicketRepository } from '../ticket/ticket.repository';
import { UserRepository } from '../user/user.repository';
import { CreateBookingDto } from './dtos/req/create-booking.dto';
import { UpdateBookingDto } from './dtos/req/update-booking.dto';
import { BookingResponseDto } from './dtos/res/booking.response.dto';
import { BookingsListResponseDto } from './dtos/res/bookings-list.response.dto';
import { BookingNotFoundException } from './exceptions/booking-not-found.exception';
import { BookingCreationFailedException } from './exceptions/booking-creation-failed.exception';
import { BookingOperationFailedException } from './exceptions/booking-operation-failed.exception';
import { InvalidBookingDataException } from './exceptions/invalid-booking-data.exception';
import { BookingUnauthorizedException } from './exceptions/booking-unauthorized.exception';
import { UserNotFoundException } from '../user/exceptions/user-not-found.exception';
import { TicketNotFoundException } from '../ticket/exceptions/ticket-not-found.exception';
import { TicketNotAvailableException } from '../ticket/exceptions/ticket-not-available.exception';
import { BookingMapper } from '../utils/mappers/booking.mapper';
import { IBookingService } from './interfaces/booking-service.interface';
import { BookingStatus } from '@prisma/client';

@Injectable()
export class BookingService implements IBookingService {
    constructor(
        private readonly bookingRepository: BookingRepository,
        private readonly ticketRepository: TicketRepository,
        private readonly userRepository: UserRepository,
    ) {}

    async createBooking(createBookingDto: CreateBookingDto): Promise<BookingResponseDto> {
        try {
            // Validate input
            if (!createBookingDto.tickets || createBookingDto.tickets.length === 0) {
                throw new InvalidBookingDataException('tickets', 'At least one ticket must be provided');
            }

            // Verify user exists
            const user = await this.userRepository.findUserById(createBookingDto.userId);
            if (!user) {
                throw new UserNotFoundException(createBookingDto.userId);
            }

            // Collect all ticket IDs that will be booked
            const ticketIds: number[] = [];

            // Process each ticket booking item
            for (const ticketItem of createBookingDto.tickets) {
                // Get available tickets for this ticket class
                const availableTickets = await this.ticketRepository.getAvailableTicketsByTicketClass(
                    ticketItem.ticketClassId
                );

                // Check if we have enough tickets
                if (availableTickets.length < ticketItem.quantity) {
                    throw new TicketNotAvailableException(
                        `Insufficient tickets for ticket class ${ticketItem.ticketClassId}. Available: ${availableTickets.length}, Requested: ${ticketItem.quantity}`
                    );
                }

                // Take the first N available tickets
                const ticketsToBook = availableTickets.slice(0, ticketItem.quantity);
                ticketIds.push(...ticketsToBook.map(ticket => ticket.id));
            }

            // Create the booking
            const booking = await this.bookingRepository.createBooking(createBookingDto.userId);

            // Update tickets to reference this booking and mark as SOLD
            await this.bookingRepository.updateTicketsBookingId(ticketIds, booking.id);
            
            // Update ticket status to SOLD
            for (const ticketId of ticketIds) {
                await this.ticketRepository.updateTicket(ticketId, { status: 'SOLD' as any });
            }

            // Return the booking with ticket details
            const bookingWithDetails = await this.bookingRepository.getBookingWithTickets(booking.id);
            if (!bookingWithDetails) {
                throw new BookingNotFoundException(booking.id);
            }

            return BookingMapper.mapToBookingResponseDto(bookingWithDetails);

        } catch (error) {
            if (error instanceof UserNotFoundException ||
                error instanceof TicketNotFoundException ||
                error instanceof TicketNotAvailableException ||
                error instanceof InvalidBookingDataException ||
                error instanceof BookingNotFoundException) {
                throw error;
            }

            // Handle database or other errors
            const message = error.message || 'Unknown error occurred';
            throw new BookingCreationFailedException(message);
        }
    }

    async getBookingById(id: number): Promise<BookingResponseDto> {
        const booking = await this.bookingRepository.getBookingWithTickets(id);
        if (!booking) {
            throw new BookingNotFoundException(id);
        }

        return BookingMapper.mapToBookingResponseDto(booking);
    }

    async getBookingsByUserId(userId: number): Promise<BookingsListResponseDto> {
        // Verify user exists
        const user = await this.userRepository.findUserById(userId);
        if (!user) {
            throw new UserNotFoundException(userId);
        }

        const bookings = await this.bookingRepository.getBookingsByUserId(userId);
        
        // Get detailed booking information
        const detailedBookings = await Promise.all(
            bookings.map(booking => this.bookingRepository.getBookingWithTickets(booking.id))
        );

        const validBookings = detailedBookings.filter(booking => booking !== null) as any[];
        
        return BookingMapper.mapToBookingsListResponseDto(validBookings, userId);
    }

    async updateBooking(id: number, updateBookingDto: UpdateBookingDto): Promise<BookingResponseDto> {
        try {
            // Check if booking exists
            const existingBooking = await this.bookingRepository.getBookingById(id);
            if (!existingBooking) {
                throw new BookingNotFoundException(id);
            }

            // Update the booking
            await this.bookingRepository.updateBooking(id, updateBookingDto);

            // Return updated booking with details
            const updatedBooking = await this.bookingRepository.getBookingWithTickets(id);
            if (!updatedBooking) {
                throw new BookingNotFoundException(id);
            }

            const bookingWithDetails = await this.bookingRepository.getBookingWithTickets(id);
            if (!bookingWithDetails) {
                throw new BookingNotFoundException(id);
            }
            return BookingMapper.mapToBookingResponseDto(bookingWithDetails);

        } catch (error) {
            if (error instanceof BookingNotFoundException) {
                throw error;
            }

            // Handle database or other errors
            const message = error.message || 'Unknown error occurred';
            throw new BookingOperationFailedException('update', message);
        }
    }

    async cancelBooking(id: number): Promise<BookingResponseDto> {
        try {
            // Check if booking exists
            const existingBooking = await this.bookingRepository.getBookingWithTickets(id);
            if (!existingBooking) {
                throw new BookingNotFoundException(id);
            }

            // Only allow cancellation of PENDING or CONFIRMED bookings
            if (existingBooking.status === BookingStatus.CANCELLED) {
                throw new BookingOperationFailedException('cancel', 'Booking is already cancelled');
            }

            // Release tickets back to available status
            await this.bookingRepository.releaseTicketsFromBooking(id);

            // Update booking status to cancelled
            await this.bookingRepository.cancelBooking(id);

            // Return updated booking
            const cancelledBooking = await this.bookingRepository.getBookingWithTickets(id);
            if (!cancelledBooking) {
                throw new BookingNotFoundException(id);
            }

            const updatedCancelledBooking = await this.bookingRepository.getBookingWithTickets(id);
            if (!updatedCancelledBooking) {
                throw new BookingNotFoundException(id);
            }
            return BookingMapper.mapToBookingResponseDto(updatedCancelledBooking);

        } catch (error) {
            if (error instanceof BookingNotFoundException ||
                error instanceof BookingOperationFailedException) {
                throw error;
            }

            // Handle database or other errors
            const message = error.message || 'Unknown error occurred';
            throw new BookingOperationFailedException('cancel', message);
        }
    }

    async confirmBooking(id: number): Promise<BookingResponseDto> {
        try {
            // Check if booking exists
            const existingBooking = await this.bookingRepository.getBookingById(id);
            if (!existingBooking) {
                throw new BookingNotFoundException(id);
            }

            // Only allow confirmation of PENDING bookings
            if (existingBooking.status !== BookingStatus.PENDING) {
                throw new BookingOperationFailedException('confirm', `Cannot confirm booking with status: ${existingBooking.status}`);
            }

            // Confirm the booking
            await this.bookingRepository.confirmBooking(id);

            // Return updated booking
            const confirmedBooking = await this.bookingRepository.getBookingWithTickets(id);
            if (!confirmedBooking) {
                throw new BookingNotFoundException(id);
            }

            const updatedConfirmedBooking = await this.bookingRepository.getBookingWithTickets(id);
            if (!updatedConfirmedBooking) {
                throw new BookingNotFoundException(id);
            }
            return BookingMapper.mapToBookingResponseDto(updatedConfirmedBooking);

        } catch (error) {
            if (error instanceof BookingNotFoundException ||
                error instanceof BookingOperationFailedException) {
                throw error;
            }

            // Handle database or other errors
            const message = error.message || 'Unknown error occurred';
            throw new BookingOperationFailedException('confirm', message);
        }
    }

    async cleanupExpiredBookings(): Promise<void> {
        try {
            // Get all pending bookings older than 15 minutes
            const expiredBookings = await this.bookingRepository.getPendingBookings();

            for (const booking of expiredBookings) {
                // Release tickets and cancel booking
                await this.bookingRepository.releaseTicketsFromBooking(booking.id);
                await this.bookingRepository.cancelBooking(booking.id);
            }

        } catch (error) {
            // Log error but don't throw - this is typically called by a scheduled job
            console.error('Failed to cleanup expired bookings:', error.message);
        }
    }

    async updateBookingStatus(id: number, status: string): Promise<BookingResponseDto> {
        try {
            // Check if booking exists
            const existingBooking = await this.bookingRepository.getBookingById(id);
            if (!existingBooking) {
                throw new BookingNotFoundException(id);
            }

            // Update the booking status
            await this.bookingRepository.updateBookingStatus(id, status);

            // Return updated booking with details
            const updatedBooking = await this.bookingRepository.getBookingWithTickets(id);
            if (!updatedBooking) {
                throw new BookingNotFoundException(id);
            }

            return BookingMapper.mapToBookingResponseDto(updatedBooking);

        } catch (error) {
            if (error instanceof BookingNotFoundException) {
                throw error;
            }

            // Handle database or other errors
            const message = error.message || 'Unknown error occurred';
            throw new BookingOperationFailedException('update status', message);
        }
    }
}
