import { IsOptional, IsEnum } from 'class-validator';
import { BookingStatus } from '@prisma/client';

export class UpdateBookingDto {
    @IsOptional()
    @IsEnum(BookingStatus)
    status?: BookingStatus;
}
