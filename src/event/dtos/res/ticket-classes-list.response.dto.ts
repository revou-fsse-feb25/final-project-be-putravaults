import { Expose, Type } from 'class-transformer';
import { TicketClassResponseDto } from './ticket-class.response.dto';

export class TicketClassesListResponseDto {
    @Expose()
    @Type(() => TicketClassResponseDto)
    ticketClasses: TicketClassResponseDto[];

    @Expose()
    eventId: number;

    @Expose()
    total: number;
}
