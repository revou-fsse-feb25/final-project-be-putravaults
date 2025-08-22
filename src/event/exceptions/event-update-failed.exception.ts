import { HttpException, HttpStatus } from '@nestjs/common';

export class EventUpdateFailedException extends HttpException {
  constructor(eventId: number, reason?: string) {
    super(
      {
        message: `Failed to update event with ID ${eventId}${reason ? `: ${reason}` : ''}`,
        error: 'Event Update Failed',
        statusCode: HttpStatus.BAD_REQUEST,
        timestamp: new Date().toISOString(),
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
