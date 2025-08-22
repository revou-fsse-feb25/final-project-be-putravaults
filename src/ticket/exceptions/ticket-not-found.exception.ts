import { NotFoundException } from '@nestjs/common';

export class TicketNotFoundException extends NotFoundException {
  constructor(ticketId: number) {
    super(`Ticket with ID ${ticketId} not found`);
  }
}
