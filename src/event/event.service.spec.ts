import { Test, TestingModule } from '@nestjs/testing';
import { EventService } from './event.service';
import { EventRepository } from './event.repository';
import { CreateEventDto } from './dtos/req/create.event.dto';
import { UpdateEventDto } from './dtos/req/update.event.dto';
import { EventResponseDto } from './dtos/res/event.response.dto';
import { EventsListResponseDto } from './dtos/res/events-list.response.dto';
import { EventNotFoundException } from './exceptions/event-not-found.exception';
import { InvalidEventDataException } from './exceptions/invalid-event-data.exception';
import { EventCreationFailedException } from './exceptions/event-creation-failed.exception';
import { EventUpdateFailedException } from './exceptions/event-update-failed.exception';
import { EventImageResponseDto } from './dtos/res/event-image.response.dto';

describe('EventService', () => {
  let service: EventService;
  let eventRepository: jest.Mocked<EventRepository>;

  const mockEventImage: EventImageResponseDto = {
    id: 1,
    eventId: 1,
    imageUrl: 'image1.jpg',
    altText: 'Event image',
    displayOrder: 1,
    isPrimary: true,
    createdAt: new Date(),
  };

  const mockEvent = {
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
    const mockEventRepository = {
      createEvent: jest.fn(),
      getEvents: jest.fn(),
      findEventById: jest.fn(),
      getUpcomingEvents: jest.fn(),
      updateEvent: jest.fn(),
      deleteEvent: jest.fn(),
      getEventTicketClasses: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventService,
        {
          provide: EventRepository,
          useValue: mockEventRepository,
        },
      ],
    }).compile();

    service = module.get<EventService>(EventService);
    eventRepository = module.get(EventRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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
      eventRepository.createEvent.mockResolvedValue(mockEvent);

      const result = await service.createEvent(createEventDto);

      expect(eventRepository.createEvent).toHaveBeenCalledWith(createEventDto);
      expect(result).toEqual(mockEventResponseDto);
    });

    it('should throw InvalidEventDataException for past date', async () => {
      const pastDateDto = { ...createEventDto, date: new Date('2020-01-01') };

      await expect(service.createEvent(pastDateDto)).rejects.toThrow(InvalidEventDataException);
      expect(eventRepository.createEvent).not.toHaveBeenCalled();
    });

    it('should throw EventCreationFailedException for repository errors', async () => {
      const error = new Error('Database error');
      eventRepository.createEvent.mockRejectedValue(error);

      await expect(service.createEvent(createEventDto)).rejects.toThrow(EventCreationFailedException);
      expect(eventRepository.createEvent).toHaveBeenCalledWith(createEventDto);
    });
  });

  describe('getEvents', () => {
    it('should return all events', async () => {
      eventRepository.getEvents.mockResolvedValue([mockEvent]);

      const result = await service.getEvents();

      expect(eventRepository.getEvents).toHaveBeenCalled();
      expect(result).toEqual(mockEventsListResponseDto);
    });
  });

  describe('getEventById', () => {
    it('should return event by id successfully', async () => {
      eventRepository.findEventById.mockResolvedValue(mockEvent);

      const result = await service.getEventById(1);

      expect(eventRepository.findEventById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockEventResponseDto);
    });

    it('should throw EventNotFoundException when event not found', async () => {
      eventRepository.findEventById.mockResolvedValue(null);

      await expect(service.getEventById(999)).rejects.toThrow(EventNotFoundException);
      expect(eventRepository.findEventById).toHaveBeenCalledWith(999);
    });
  });

  describe('getUpcomingEvents', () => {
    it('should return upcoming events', async () => {
      eventRepository.getUpcomingEvents.mockResolvedValue([mockEvent]);

      const result = await service.getUpcomingEvents();

      expect(eventRepository.getUpcomingEvents).toHaveBeenCalled();
      expect(result).toEqual(mockEventsListResponseDto);
    });
  });

  describe('updateEvent', () => {
    const updateEventDto: UpdateEventDto = {
      name: 'Updated Concert Event',
      description: 'An updated great concert',
    };

    it('should update event successfully', async () => {
      eventRepository.findEventById.mockResolvedValue(mockEvent);
      eventRepository.updateEvent.mockResolvedValue(mockEvent);

      const result = await service.updateEvent(1, updateEventDto);

      expect(eventRepository.findEventById).toHaveBeenCalledWith(1);
      expect(eventRepository.updateEvent).toHaveBeenCalledWith(1, updateEventDto);
      expect(result).toEqual(mockEventResponseDto);
    });

    it('should throw EventNotFoundException when event not found', async () => {
      eventRepository.findEventById.mockResolvedValue(null);

      await expect(service.updateEvent(999, updateEventDto)).rejects.toThrow(EventNotFoundException);
      expect(eventRepository.findEventById).toHaveBeenCalledWith(999);
      expect(eventRepository.updateEvent).not.toHaveBeenCalled();
    });

    it('should throw InvalidEventDataException for past date', async () => {
      eventRepository.findEventById.mockResolvedValue(mockEvent);
      const pastDateDto = { ...updateEventDto, date: new Date('2020-01-01') };

      await expect(service.updateEvent(1, pastDateDto)).rejects.toThrow(InvalidEventDataException);
      expect(eventRepository.findEventById).toHaveBeenCalledWith(1);
      expect(eventRepository.updateEvent).not.toHaveBeenCalled();
    });

    it('should throw EventUpdateFailedException for repository errors', async () => {
      eventRepository.findEventById.mockResolvedValue(mockEvent);
      const error = new Error('Database error');
      eventRepository.updateEvent.mockRejectedValue(error);

      await expect(service.updateEvent(1, updateEventDto)).rejects.toThrow(EventUpdateFailedException);
      expect(eventRepository.findEventById).toHaveBeenCalledWith(1);
      expect(eventRepository.updateEvent).toHaveBeenCalledWith(1, updateEventDto);
    });
  });

  describe('deleteEvent', () => {
    it('should delete event successfully', async () => {
      eventRepository.findEventById.mockResolvedValue(mockEvent);
      eventRepository.deleteEvent.mockResolvedValue(undefined);

      await service.deleteEvent(1);

      expect(eventRepository.findEventById).toHaveBeenCalledWith(1);
      expect(eventRepository.deleteEvent).toHaveBeenCalledWith(1);
    });

    it('should throw EventNotFoundException when event not found', async () => {
      eventRepository.findEventById.mockResolvedValue(null);

      await expect(service.deleteEvent(999)).rejects.toThrow(EventNotFoundException);
      expect(eventRepository.findEventById).toHaveBeenCalledWith(999);
      expect(eventRepository.deleteEvent).not.toHaveBeenCalled();
    });
  });
});
