import { CreateEventDto } from '../dtos/req/create.event.dto';
import { UpdateEventDto } from '../dtos/req/update.event.dto';
import { EventResponseDto } from '../dtos/res/event.response.dto';
import { EventsListResponseDto } from '../dtos/res/events-list.response.dto';
import { TicketClassesListResponseDto } from '../dtos/res/ticket-classes-list.response.dto';

export interface IEventService {
  createEvent(createEventDto: CreateEventDto): Promise<EventResponseDto>;
  getEvents(): Promise<EventsListResponseDto>;
  getUpcomingEvents(): Promise<EventsListResponseDto>;
  getEventById(id: number): Promise<EventResponseDto>;
  updateEvent(id: number, updateEventDto: UpdateEventDto): Promise<EventResponseDto>;
  deleteEvent(id: number): Promise<void>;
  getEventTicketClasses(eventId: number): Promise<TicketClassesListResponseDto>;
}
