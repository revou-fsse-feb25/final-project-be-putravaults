import { ReserveTicketsDto } from '../dtos/req/reserve-tickets.dto';
import { UpdateTicketDto } from '../dtos/req/update-ticket.dto';

export interface ITicketRepository {
  // Get tickets
  getTicketsByEvent(eventId: number): Promise<any[]>;
  getTicketsByTicketClass(ticketClassId: number): Promise<any[]>;
  getAvailableTicketsByTicketClass(ticketClassId: number): Promise<any[]>;
  getTicketById(id: number): Promise<any | null>;
  
  // Availability
  getTicketAvailabilityByEvent(eventId: number): Promise<any[]>;
  
  // Reserve/Update tickets
  reserveTickets(reserveTicketsDto: ReserveTicketsDto): Promise<any[]>;
  updateTicket(id: number, updateTicketDto: UpdateTicketDto): Promise<any>;
  
  // Bulk operations
  updateTicketsStatus(ticketIds: number[], status: 'AVAILABLE' | 'SOLD' | 'RESERVED'): Promise<void>;
  
  // Booking operations
  assignTicketsToBooking(ticketIds: number[], bookingId: number): Promise<void>;
  releaseReservedTickets(eventId: number, olderThan: Date): Promise<void>;
}
