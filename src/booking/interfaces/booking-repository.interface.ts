import { Booking } from '@prisma/client';
import { UpdateBookingDto } from '../dtos/req/update-booking.dto';

export interface IBookingRepository {
    createBooking(userId: number): Promise<Booking>;
    getBookingById(id: number): Promise<Booking | null>;
    getBookingsByUserId(userId: number): Promise<Booking[]>;
    updateBooking(id: number, updateBookingDto: UpdateBookingDto): Promise<Booking>;
    cancelBooking(id: number): Promise<Booking>;
    confirmBooking(id: number): Promise<Booking>;
    getBookingWithTickets(id: number): Promise<any>;
    getPendingBookings(): Promise<Booking[]>;
    updateTicketsBookingId(ticketIds: number[], bookingId: number): Promise<void>;
}
