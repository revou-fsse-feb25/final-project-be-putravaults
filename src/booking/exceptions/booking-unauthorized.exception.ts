import { ForbiddenException } from '@nestjs/common';

export class BookingUnauthorizedException extends ForbiddenException {
    constructor(reason: string = 'You are not authorized to access this booking') {
        super(reason);
    }
}
