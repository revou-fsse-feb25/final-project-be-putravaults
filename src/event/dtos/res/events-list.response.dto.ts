import { Expose, Type } from 'class-transformer';
import { EventResponseDto } from './event.response.dto';

export class EventsListResponseDto {
    @Expose()
    @Type(() => EventResponseDto)
    events: EventResponseDto[];

    @Expose()
    total: number;
}
