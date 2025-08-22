import { Expose, Type } from 'class-transformer';

export class ReservedTicketDto {
    @Expose()
    id: number;

    @Expose()
    seatNumber: string | null;

    @Expose()
    status: string;
}

export class ReserveTicketsResponseDto {
    @Expose()
    @Type(() => ReservedTicketDto)
    reservedTickets: ReservedTicketDto[];

    @Expose()
    eventId: number;

    @Expose()
    ticketClassId: number;

    @Expose()
    totalReserved: number;

    @Expose()
    expiresAt: Date; // When the reservation expires

    @Expose()
    message: string;
}
