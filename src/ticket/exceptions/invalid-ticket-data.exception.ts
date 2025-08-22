import { BadRequestException } from '@nestjs/common';

export class InvalidTicketDataException extends BadRequestException {
  constructor(field: string, message: string) {
    super(`Invalid ${field}: ${message}`);
  }
}
