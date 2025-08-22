import { BaseMapper } from './base.mapper';
import { TicketResponseDto } from '../../ticket/dtos/res/ticket.response.dto';
import { TicketsListResponseDto } from '../../ticket/dtos/res/tickets-list.response.dto';
import { TicketAvailabilityResponseDto, TicketClassAvailabilityDto } from '../../ticket/dtos/res/ticket-availability.response.dto';
import { ReserveTicketsResponseDto, ReservedTicketDto } from '../../ticket/dtos/res/reserve-tickets.response.dto';

export class TicketMapper extends BaseMapper {
  /**
   * Maps a single ticket entity to TicketResponseDto
   */
  static mapToTicketResponseDto(ticket: any): TicketResponseDto {
    return this.mapToDto(TicketResponseDto, {
      ...ticket,
      ticketClass: ticket.ticketClass ? {
        id: ticket.ticketClass.id,
        name: ticket.ticketClass.name,
        description: ticket.ticketClass.description,
        price: Number(ticket.ticketClass.price),
      } : undefined,
      event: ticket.event ? {
        id: ticket.event.id,
        name: ticket.event.name,
        date: ticket.event.date,
        location: ticket.event.location,
      } : undefined,
    });
  }

  /**
   * Maps an array of tickets to TicketResponseDto array
   */
  static mapToTicketResponseDtoArray(tickets: any[]): TicketResponseDto[] {
    return tickets.map(ticket => this.mapToTicketResponseDto(ticket));
  }

  /**
   * Maps tickets array to TicketsListResponseDto
   */
  static mapToTicketsListResponseDto(
    tickets: any[], 
    eventId?: number, 
    ticketClassId?: number
  ): TicketsListResponseDto {
    return this.mapToDto(TicketsListResponseDto, {
      tickets: this.mapToTicketResponseDtoArray(tickets),
      total: tickets.length,
      eventId,
      ticketClassId,
    });
  }

  /**
   * Maps ticket class availability data to TicketClassAvailabilityDto
   */
  static mapToTicketClassAvailabilityDto(ticketClass: any, counts: any): TicketClassAvailabilityDto {
    const soldCount = counts.soldCount || 0;
    const reservedCount = counts.reservedCount || 0;
    const availableCount = ticketClass.totalCount - soldCount - reservedCount;

    return this.mapToDto(TicketClassAvailabilityDto, {
      ticketClassId: ticketClass.id,
      ticketClassName: ticketClass.name,
      description: ticketClass.description,
      price: Number(ticketClass.price),
      totalCount: ticketClass.totalCount,
      soldCount,
      reservedCount,
      availableCount: Math.max(0, availableCount),
    });
  }

  /**
   * Maps event ticket availability to TicketAvailabilityResponseDto
   */
  static mapToTicketAvailabilityResponseDto(
    event: any,
    ticketClassesWithCounts: any[]
  ): TicketAvailabilityResponseDto {
    const ticketClasses = ticketClassesWithCounts.map(item => 
      this.mapToTicketClassAvailabilityDto(item.ticketClass, item.counts)
    );

    const totalAvailable = ticketClasses.reduce((sum, tc) => sum + tc.availableCount, 0);

    return this.mapToDto(TicketAvailabilityResponseDto, {
      eventId: event.id,
      eventName: event.name,
      ticketClasses,
      totalAvailable,
    });
  }

  /**
   * Maps reserved tickets to ReserveTicketsResponseDto
   */
  static mapToReserveTicketsResponseDto(
    reservedTickets: any[],
    eventId: number,
    ticketClassId: number,
    expiresAt: Date
  ): ReserveTicketsResponseDto {
    const reservedTicketDtos = reservedTickets.map(ticket => 
      this.mapToDto(ReservedTicketDto, {
        id: ticket.id,
        seatNumber: ticket.seatNumber,
        status: ticket.status,
      })
    );

    return this.mapToDto(ReserveTicketsResponseDto, {
      reservedTickets: reservedTicketDtos,
      eventId,
      ticketClassId,
      totalReserved: reservedTickets.length,
      expiresAt,
      message: `Successfully reserved ${reservedTickets.length} ticket(s)`,
    });
  }
}
