import { BadRequestException } from '@nestjs/common';

export class BookingCreationFailedException extends BadRequestException {
    constructor(reason: string) {
        super(`Booking creation failed: ${reason}`);
    }
}
