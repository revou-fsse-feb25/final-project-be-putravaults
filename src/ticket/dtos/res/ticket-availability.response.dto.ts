import { Expose, Type } from 'class-transformer';

export class TicketClassAvailabilityDto {
    @Expose()
    ticketClassId: number;

    @Expose()
    ticketClassName: string;

    @Expose()
    description: string | null;

    @Expose()
    price: number;

    @Expose()
    totalCount: number;

    @Expose()
    soldCount: number;

    @Expose()
    reservedCount: number;

    @Expose()
    availableCount: number;
}

export class TicketAvailabilityResponseDto {
    @Expose()
    eventId: number;

    @Expose()
    eventName: string;

    @Expose()
    @Type(() => TicketClassAvailabilityDto)
    ticketClasses: TicketClassAvailabilityDto[];

    @Expose()
    totalAvailable: number;
}
