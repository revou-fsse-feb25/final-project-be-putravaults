import { BadRequestException } from '@nestjs/common';

export class InvalidBookingDataException extends BadRequestException {
    constructor(field: string, reason: string) {
        super(`Invalid booking data for field '${field}': ${reason}`);
    }
}
