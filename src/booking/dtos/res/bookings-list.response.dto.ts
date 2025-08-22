import { BookingResponseDto } from './booking.response.dto';

export interface BookingsListResponseDto {
    bookings: BookingResponseDto[];
    total: number;
    userId?: number;
}
