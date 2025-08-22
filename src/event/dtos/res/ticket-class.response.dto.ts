import { Expose } from 'class-transformer';

export class TicketClassResponseDto {
    @Expose()
    id: number;

    @Expose()
    eventId: number;

    @Expose()
    name: string;

    @Expose()
    description: string | null;

    @Expose()
    price: number;

    @Expose()
    totalCount: number;

    @Expose()
    soldCount: number;

    @Expose()
    availableCount: number; // Calculated field

    @Expose()
    createdAt: Date;
}
