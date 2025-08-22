import { Test, TestingModule } from '@nestjs/testing';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { CreateEventDto } from './dtos/req/create.event.dto';
import { UpdateEventDto } from './dtos/req/update.event.dto';
import { EventResponseDto } from './dtos/res/event.response.dto';
import { EventsListResponseDto } from './dtos/res/events-list.response.dto';
import { EventImageResponseDto } from './dtos/res/event-image.response.dto';

describe('EventController', () => {
  let controller: EventController;
  let eventService: jest.Mocked<EventService>;

  const mockEventImage: EventImageResponseDto = {
    id: 1,
    eventId: 1,
    imageUrl: 'image1.jpg',
    altText: 'Event image',
    displayOrder: 1,
    isPrimary: true,
    createdAt: new Date(),
  };

  const mockEventResponseDto: EventResponseDto = {
    id: 1,
    name: 'Concert Event',
    description: 'A great concert',
    date: new Date('2024-12-31'),
    location: 'Concert Hall',
    thumbnailUrl: 'thumbnail.jpg',
    bannerUrl: 'banner.jpg',
    createdAt: new Date(),
    updatedAt: new Date(),
    images: [mockEventImage],
  };

  const mockEventsListResponseDto: EventsListResponseDto = {
    events: [mockEventResponseDto],
    total: 1,
  };

  beforeEach(async () => {
    const mockEventService = {
      createEvent: jest.fn(),
      getEvents: jest.fn(),
      getEventById: jest.fn(),
      getUpcomingEvents: jest.fn(),
      updateEvent: jest.fn(),
      deleteEvent: jest.fn(),
      getEventTicketClasses: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventController],
      providers: [
        {
          provide: EventService,
          useValue: mockEventService,
        },
      ],
    }).compile();

    controller = module.get<EventController>(EventController);
    eventService = module.get(EventService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createEvent', () => {
    const createEventDto: CreateEventDto = {
      name: 'Concert Event',
      description: 'A great concert',
      date: new Date('2024-12-31'),
      location: 'Concert Hall',
      thumbnailUrl: 'thumbnail.jpg',
      bannerUrl: 'banner.jpg',
    };

    it('should create an event successfully', async () => {
      eventService.createEvent.mockResolvedValue(mockEventResponseDto);

      const result = await controller.createEvent(createEventDto);

      expect(eventService.createEvent).toHaveBeenCalledWith(createEventDto);
      expect(result).toEqual(mockEventResponseDto);
    });

    it('should handle service errors', async () => {
      const error = new Error('Service error');
      eventService.createEvent.mockRejectedValue(error);

      await expect(controller.createEvent(createEventDto)).rejects.toThrow('Service error');
      expect(eventService.createEvent).toHaveBeenCalledWith(createEventDto);
    });
  });

  describe('getEvents', () => {
    it('should return all events', async () => {
      eventService.getEvents.mockResolvedValue(mockEventsListResponseDto);

      const result = await controller.getEvents();

      expect(eventService.getEvents).toHaveBeenCalled();
      expect(result).toEqual(mockEventsListResponseDto);
    });
  });

  describe('getEventById', () => {
    it('should return event by id successfully', async () => {
      eventService.getEventById.mockResolvedValue(mockEventResponseDto);

      const result = await controller.getEventById(1);

      expect(eventService.getEventById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockEventResponseDto);
    });

    it('should handle service errors', async () => {
      const error = new Error('Event not found');
      eventService.getEventById.mockRejectedValue(error);

      await expect(controller.getEventById(999)).rejects.toThrow('Event not found');
      expect(eventService.getEventById).toHaveBeenCalledWith(999);
    });
  });

  describe('getUpcomingEvents', () => {
    it('should return upcoming events', async () => {
      eventService.getUpcomingEvents.mockResolvedValue(mockEventsListResponseDto);

      const result = await controller.getUpcomingEvents();

      expect(eventService.getUpcomingEvents).toHaveBeenCalled();
      expect(result).toEqual(mockEventsListResponseDto);
    });
  });

  describe('updateEvent', () => {
    const updateEventDto: UpdateEventDto = {
      name: 'Updated Concert Event',
      description: 'An updated great concert',
    };

    it('should update event successfully', async () => {
      eventService.updateEvent.mockResolvedValue(mockEventResponseDto);

      const result = await controller.updateEvent(1, updateEventDto);

      expect(eventService.updateEvent).toHaveBeenCalledWith(1, updateEventDto);
      expect(result).toEqual(mockEventResponseDto);
    });

    it('should handle service errors', async () => {
      const error = new Error('Event not found');
      eventService.updateEvent.mockRejectedValue(error);

      await expect(controller.updateEvent(999, updateEventDto)).rejects.toThrow('Event not found');
      expect(eventService.updateEvent).toHaveBeenCalledWith(999, updateEventDto);
    });
  });

  describe('deleteEvent', () => {
    it('should delete event successfully', async () => {
      eventService.deleteEvent.mockResolvedValue(undefined);

      await controller.deleteEvent(1);

      expect(eventService.deleteEvent).toHaveBeenCalledWith(1);
    });

    it('should handle service errors', async () => {
      const error = new Error('Event not found');
      eventService.deleteEvent.mockRejectedValue(error);

      await expect(controller.deleteEvent(999)).rejects.toThrow('Event not found');
      expect(eventService.deleteEvent).toHaveBeenCalledWith(999);
    });
  });
});
