import { InternalServerErrorException } from '@nestjs/common';

export class TicketOperationFailedException extends InternalServerErrorException {
  constructor(operation: string, details?: string) {
    super(`Ticket ${operation} failed${details ? `: ${details}` : ''}`);
  }
}
