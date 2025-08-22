import { BadRequestException } from '@nestjs/common';

export class BookingOperationFailedException extends BadRequestException {
    constructor(operation: string, reason: string) {
        super(`Booking ${operation} failed: ${reason}`);
    }
}
