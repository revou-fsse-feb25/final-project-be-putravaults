import { BaseMapper } from './base.mapper';
import { EventResponseDto } from '../../event/dtos/res/event.response.dto';
import { EventImageResponseDto } from '../../event/dtos/res/event-image.response.dto';
import { EventsListResponseDto } from '../../event/dtos/res/events-list.response.dto';
import { TicketClassResponseDto } from '../../event/dtos/res/ticket-class.response.dto';
import { TicketClassesListResponseDto } from '../../event/dtos/res/ticket-classes-list.response.dto';

export class EventMapper extends BaseMapper {
  /**
   * Maps a single event entity to EventResponseDto
   */
  static mapToEventResponseDto(event: any): EventResponseDto {
    return this.mapWithRelations(EventResponseDto, event, {
      images: EventImageResponseDto,
    });
  }

  /**
   * Maps an array of events to EventResponseDto array
   */
  static mapToEventResponseDtoArray(events: any[]): EventResponseDto[] {
    return events.map(event => this.mapToEventResponseDto(event));
  }

  /**
   * Maps events array to EventsListResponseDto
   */
  static mapToEventsListResponseDto(events: any[]): EventsListResponseDto {
    return this.mapToDto(EventsListResponseDto, {
      events: this.mapToEventResponseDtoArray(events),
      total: events.length,
    });
  }

  /**
   * Maps a single event image to EventImageResponseDto
   */
  static mapToEventImageResponseDto(image: any): EventImageResponseDto {
    return this.mapToDto(EventImageResponseDto, image);
  }

  /**
   * Maps event images array to EventImageResponseDto array
   */
  static mapToEventImageResponseDtoArray(images: any[]): EventImageResponseDto[] {
    return this.mapToDtoArray(EventImageResponseDto, images);
  }

  /**
   * Maps a single ticket class entity to TicketClassResponseDto
   */
  static mapToTicketClassResponseDto(ticketClass: any): TicketClassResponseDto {
    return this.mapToDto(TicketClassResponseDto, {
      ...ticketClass,
      price: Number(ticketClass.price), // Convert Decimal to number
      availableCount: ticketClass.totalCount - ticketClass.soldCount,
    });
  }

  /**
   * Maps an array of ticket classes to TicketClassResponseDto array
   */
  static mapToTicketClassResponseDtoArray(ticketClasses: any[]): TicketClassResponseDto[] {
    return ticketClasses.map(ticketClass => this.mapToTicketClassResponseDto(ticketClass));
  }

  /**
   * Maps ticket classes array to TicketClassesListResponseDto
   */
  static mapToTicketClassesListResponseDto(ticketClasses: any[], eventId: number): TicketClassesListResponseDto {
    return this.mapToDto(TicketClassesListResponseDto, {
      ticketClasses: this.mapToTicketClassResponseDtoArray(ticketClasses),
      eventId,
      total: ticketClasses.length,
    });
  }
}
