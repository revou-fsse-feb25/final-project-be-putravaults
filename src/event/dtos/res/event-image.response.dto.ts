import { Expose } from 'class-transformer';

export class EventImageResponseDto {
    @Expose()
    id: number;

    @Expose()
    eventId: number;

    @Expose()
    imageUrl: string;

    @Expose()
    altText: string | null;

    @Expose()
    displayOrder: number;

    @Expose()
    isPrimary: boolean;

    @Expose()
    createdAt: Date;
}
