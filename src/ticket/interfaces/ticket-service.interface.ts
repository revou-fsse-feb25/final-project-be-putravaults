import { ReserveTicketsDto } from '../dtos/req/reserve-tickets.dto';
import { UpdateTicketDto } from '../dtos/req/update-ticket.dto';
import { CreateTicketDto } from '../dtos/req/create-ticket.dto';
import { TicketResponseDto } from '../dtos/res/ticket.response.dto';
import { TicketsListResponseDto } from '../dtos/res/tickets-list.response.dto';
import { TicketAvailabilityResponseDto } from '../dtos/res/ticket-availability.response.dto';
import { ReserveTicketsResponseDto } from '../dtos/res/reserve-tickets.response.dto';

export interface ITicketService {
  // Get tickets
  getTicketsByEvent(eventId: number): Promise<TicketsListResponseDto>;
  getTicketsByTicketClass(ticketClassId: number): Promise<TicketsListResponseDto>;
  getTicketById(id: number): Promise<TicketResponseDto>;
  
  // Availability
  getTicketAvailabilityByEvent(eventId: number): Promise<TicketAvailabilityResponseDto>;
  
  // Reserve tickets
  reserveTickets(reserveTicketsDto: ReserveTicketsDto): Promise<ReserveTicketsResponseDto>;
  
  // Create ticket
  createTicket(createTicketDto: CreateTicketDto): Promise<TicketResponseDto>;
  
  // Update ticket
  updateTicket(id: number, updateTicketDto: UpdateTicketDto): Promise<TicketResponseDto>;
  
  // Admin operations
  releaseExpiredReservations(): Promise<void>;
}
