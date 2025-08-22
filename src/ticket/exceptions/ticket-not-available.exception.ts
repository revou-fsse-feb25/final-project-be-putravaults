import { BadRequestException } from '@nestjs/common';

export class TicketNotAvailableException extends BadRequestException {
  constructor(message?: string) {
    super(message || 'Tickets are not available for reservation');
  }
}
