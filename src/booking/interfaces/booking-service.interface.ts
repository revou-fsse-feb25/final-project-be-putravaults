import { CreateBookingDto } from '../dtos/req/create-booking.dto';
import { UpdateBookingDto } from '../dtos/req/update-booking.dto';
import { BookingResponseDto } from '../dtos/res/booking.response.dto';
import { BookingsListResponseDto } from '../dtos/res/bookings-list.response.dto';

export interface IBookingService {
    createBooking(createBookingDto: CreateBookingDto): Promise<BookingResponseDto>;
    getBookingById(id: number): Promise<BookingResponseDto>;
    getBookingsByUserId(userId: number): Promise<BookingsListResponseDto>;
    updateBooking(id: number, updateBookingDto: UpdateBookingDto): Promise<BookingResponseDto>;
    cancelBooking(id: number): Promise<BookingResponseDto>;
    confirmBooking(id: number): Promise<BookingResponseDto>;
    cleanupExpiredBookings(): Promise<void>;
}
