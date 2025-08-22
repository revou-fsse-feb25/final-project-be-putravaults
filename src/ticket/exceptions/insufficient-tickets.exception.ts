import { BadRequestException } from '@nestjs/common';

export class InsufficientTicketsException extends BadRequestException {
  constructor(requested: number, available: number) {
    super(`Insufficient tickets. Requested: ${requested}, Available: ${available}`);
  }
}
