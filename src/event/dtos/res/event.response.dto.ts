import { Expose, Type } from 'class-transformer';
import { EventImageResponseDto } from './event-image.response.dto';

export class EventResponseDto {
    @Expose()
    id: number;

    @Expose()
    name: string;

    @Expose()
    description: string;

    @Expose()
    date: Date;

    @Expose()
    location: string;

    @Expose()
    thumbnailUrl: string | null;

    @Expose()
    bannerUrl: string | null;

    @Expose()
    createdAt: Date;

    @Expose()
    updatedAt: Date;

    @Expose()
    @Type(() => EventImageResponseDto)
    images: EventImageResponseDto[];
}
