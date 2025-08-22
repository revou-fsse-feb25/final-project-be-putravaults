import { EventMapper } from './event.mapper';
import { EventImageResponseDto } from '../../event/dtos/res/event-image.response.dto';

describe('EventMapper', () => {
  const mockEventImage: EventImageResponseDto = {
    id: 1,
    eventId: 1,
    imageUrl: 'image1.jpg',
    altText: 'Event image',
    displayOrder: 1,
    isPrimary: true,
    createdAt: new Date('2024-01-01'),
  };

  const mockEvent = {
    id: 1,
    name: 'Concert Event',
    description: 'A great concert',
    date: new Date('2024-12-31'),
    location: 'Concert Hall',
    thumbnailUrl: 'thumbnail.jpg',
    bannerUrl: 'banner.jpg',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-02'),
    images: [mockEventImage],
  };

  describe('mapToEventResponseDto', () => {
    it('should map event to EventResponseDto', () => {
      const result = EventMapper.mapToEventResponseDto(mockEvent);

      expect(result).toEqual({
        id: 1,
        name: 'Concert Event',
        description: 'A great concert',
        date: new Date('2024-12-31'),
        location: 'Concert Hall',
        thumbnailUrl: 'thumbnail.jpg',
        bannerUrl: 'banner.jpg',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-02'),
        images: [mockEventImage],
      });
    });

    it('should handle null values', () => {
      const eventWithNulls = {
        ...mockEvent,
        thumbnailUrl: null,
        bannerUrl: null,
        images: [],
      };

      const result = EventMapper.mapToEventResponseDto(eventWithNulls);

      expect(result).toEqual({
        id: 1,
        name: 'Concert Event',
        description: 'A great concert',
        date: new Date('2024-12-31'),
        location: 'Concert Hall',
        thumbnailUrl: null,
        bannerUrl: null,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-02'),
        images: [],
      });
    });
  });

  describe('mapToEventsListResponseDto', () => {
    it('should map events array to EventsListResponseDto', () => {
      const events = [mockEvent, { ...mockEvent, id: 2, name: 'Another Event' }];

      const result = EventMapper.mapToEventsListResponseDto(events);

      expect(result).toEqual({
        events: [
          {
            id: 1,
            name: 'Concert Event',
            description: 'A great concert',
            date: new Date('2024-12-31'),
            location: 'Concert Hall',
            thumbnailUrl: 'thumbnail.jpg',
            bannerUrl: 'banner.jpg',
            createdAt: new Date('2024-01-01'),
            updatedAt: new Date('2024-01-02'),
            images: [mockEventImage],
          },
          {
            id: 2,
            name: 'Another Event',
            description: 'A great concert',
            date: new Date('2024-12-31'),
            location: 'Concert Hall',
            thumbnailUrl: 'thumbnail.jpg',
            bannerUrl: 'banner.jpg',
            createdAt: new Date('2024-01-01'),
            updatedAt: new Date('2024-01-02'),
            images: [mockEventImage],
          },
        ],
        total: 2,
      });
    });

    it('should handle empty array', () => {
      const result = EventMapper.mapToEventsListResponseDto([]);

      expect(result).toEqual({
        events: [],
        total: 0,
      });
    });
  });
});
