import { Expose, Type } from 'class-transformer';
import { TicketResponseDto } from './ticket.response.dto';

export class TicketsListResponseDto {
    @Expose()
    @Type(() => TicketResponseDto)
    tickets: TicketResponseDto[];

    @Expose()
    total: number;

    @Expose()
    eventId?: number;

    @Expose()
    ticketClassId?: number;
}
