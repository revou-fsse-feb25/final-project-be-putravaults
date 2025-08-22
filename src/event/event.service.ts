import { Injectable } from '@nestjs/common';
import { EventRepository } from './event.repository';
import { CreateEventDto } from './dtos/req/create.event.dto';
import { UpdateEventDto } from './dtos/req/update.event.dto';
import { CreateTicketClassDto } from './dtos/req/create-ticket-class.dto';
import { EventResponseDto } from './dtos/res/event.response.dto';
import { EventsListResponseDto } from './dtos/res/events-list.response.dto';
import { TicketClassesListResponseDto } from './dtos/res/ticket-classes-list.response.dto';
import { TicketClassResponseDto } from './dtos/res/ticket-class.response.dto';
import { EventNotFoundException } from './exceptions/event-not-found.exception';
import { EventCreationFailedException } from './exceptions/event-creation-failed.exception';
import { EventUpdateFailedException } from './exceptions/event-update-failed.exception';
import { InvalidEventDataException } from './exceptions/invalid-event-data.exception';
import { EventMapper } from '../utils/mappers/event.mapper';
import { IEventService } from './interfaces/event-service.interface';

@Injectable()
export class EventService implements IEventService {

    constructor(private readonly eventRepository: EventRepository) {}
    
    async createEvent(createEventDto: CreateEventDto): Promise<EventResponseDto> {
        try {
            // Validate event date is in the future
            if (createEventDto.date && new Date(createEventDto.date) <= new Date()) {
                throw new InvalidEventDataException('date', 'Event date must be in the future');
            }

            const event = await this.eventRepository.createEvent(createEventDto);
            return EventMapper.mapToEventResponseDto(event);
        } catch (error) {
            if (error instanceof InvalidEventDataException) {
                throw error;
            }
            
            // Handle database or other errors
            const message = error.message || 'Unknown error occurred';
            throw new EventCreationFailedException(message);
        }
    }

    async getEvents(): Promise<EventsListResponseDto> {
        const events = await this.eventRepository.getEvents();
        return EventMapper.mapToEventsListResponseDto(events);
    }

    async getEventById(id: number): Promise<EventResponseDto> {
        const event = await this.eventRepository.findEventById(id);
        if (!event) {
            throw new EventNotFoundException(id);
        }
        return EventMapper.mapToEventResponseDto(event);
    }

    async getUpcomingEvents(): Promise<EventsListResponseDto> {
        const events = await this.eventRepository.getUpcomingEvents();
        return EventMapper.mapToEventsListResponseDto(events);
    }

    async updateEvent(id: number, updateEventDto: UpdateEventDto): Promise<EventResponseDto> {
        try {
            // Check if event exists
            const existingEvent = await this.eventRepository.findEventById(id);
            if (!existingEvent) {
                throw new EventNotFoundException(id);
            }

            // Validate event date is in the future if provided
            if (updateEventDto.date && new Date(updateEventDto.date) <= new Date()) {
                throw new InvalidEventDataException('date', 'Event date must be in the future');
            }

            const updatedEvent = await this.eventRepository.updateEvent(id, updateEventDto);
            return EventMapper.mapToEventResponseDto(updatedEvent);
        } catch (error) {
            if (error instanceof EventNotFoundException || error instanceof InvalidEventDataException) {
                throw error;
            }
            
            // Handle database or other errors
            const message = error.message || 'Unknown error occurred';
            throw new EventUpdateFailedException(id, message);
        }
    }

    async deleteEvent(id: number): Promise<void> {
        // Check if event exists
        const existingEvent = await this.eventRepository.findEventById(id);
        if (!existingEvent) {
            throw new EventNotFoundException(id);
        }

        await this.eventRepository.deleteEvent(id);
    }

    async getEventTicketClasses(eventId: number): Promise<TicketClassesListResponseDto> {
        // Check if event exists
        const existingEvent = await this.eventRepository.findEventById(eventId);
        if (!existingEvent) {
            throw new EventNotFoundException(eventId);
        }

        const ticketClasses = await this.eventRepository.getEventTicketClasses(eventId);
        return EventMapper.mapToTicketClassesListResponseDto(ticketClasses, eventId);
    }

    async createTicketClass(createTicketClassDto: CreateTicketClassDto): Promise<TicketClassResponseDto> {
        try {
            // Check if event exists
            const existingEvent = await this.eventRepository.findEventById(createTicketClassDto.eventId);
            if (!existingEvent) {
                throw new EventNotFoundException(createTicketClassDto.eventId);
            }

            const ticketClass = await this.eventRepository.createTicketClass(createTicketClassDto);
            return EventMapper.mapToTicketClassResponseDto(ticketClass);
        } catch (error) {
            if (error instanceof EventNotFoundException) {
                throw error;
            }
            
            // Handle database or other errors
            const message = error.message || 'Unknown error occurred';
            throw new EventCreationFailedException(message);
        }
    }
}