import { Expose } from 'class-transformer';

export class TicketClassResponseDto {
    @Expose()
    id: number;

    @Expose()
    eventId: number;

    @Expose()
    name: string;

    @Expose()
    description?: string;

    @Expose()
    price: number;

    @Expose()
    totalCount: number;

    @Expose()
    soldCount: number;

    @Expose()
    availableCount: number;

    @Expose()
    createdAt: Date;
}
