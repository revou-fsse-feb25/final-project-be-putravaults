import { Expose, Type } from 'class-transformer';

export class TicketResponseDto {
    @Expose()
    id: number;

    @Expose()
    eventId: number;

    @Expose()
    ticketClassId: number;

    @Expose()
    bookingId: number | null;

    @Expose()
    seatNumber: string | null;

    @Expose()
    status: string;

    @Expose()
    ticketClass: {
        id: number;
        name: string;
        description: string | null;
        price: number;
    };

    @Expose()
    event: {
        id: number;
        name: string;
        date: Date;
        location: string;
    };
}
