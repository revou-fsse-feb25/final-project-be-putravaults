import { HttpException, HttpStatus } from '@nestjs/common';

export class EventNotFoundException extends HttpException {
  constructor(eventId: number) {
    super(
      {
        message: `Event with ID ${eventId} not found`,
        error: 'Event Not Found',
        statusCode: HttpStatus.NOT_FOUND,
        timestamp: new Date().toISOString(),
      },
      HttpStatus.NOT_FOUND,
    );
  }
}
