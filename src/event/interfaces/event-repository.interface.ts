import { CreateEventDto } from '../dtos/req/create.event.dto';
import { UpdateEventDto } from '../dtos/req/update.event.dto';

export interface IEventRepository {
  createEvent(createEventDto: CreateEventDto): Promise<any>;
  getEvents(): Promise<any[]>;
  getUpcomingEvents(): Promise<any[]>;
  updateEvent(id: number, updateEventDto: UpdateEventDto): Promise<any>;
  findEventById(id: number): Promise<any | null>;
  deleteEvent(id: number): Promise<void>;
  getEventTicketClasses(eventId: number): Promise<any[]>;
}
