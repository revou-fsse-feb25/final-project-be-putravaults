import { IsNotEmpty, IsNumber, IsString, IsOptional, IsEnum } from 'class-validator';
import { TicketStatus } from '@prisma/client';

export class CreateTicketDto {
    @IsNotEmpty()
    @IsNumber()
    eventId: number;

    @IsNotEmpty()
    @IsNumber()
    ticketClassId: number;

    @IsOptional()
    @IsString()
    seatNumber?: string;

    @IsOptional()
    @IsEnum(TicketStatus)
    status?: TicketStatus;
}
