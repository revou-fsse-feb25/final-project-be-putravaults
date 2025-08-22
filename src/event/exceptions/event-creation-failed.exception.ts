import { HttpException, HttpStatus } from '@nestjs/common';

export class EventCreationFailedException extends HttpException {
  constructor(reason?: string) {
    super(
      {
        message: `Failed to create event${reason ? `: ${reason}` : ''}`,
        error: 'Event Creation Failed',
        statusCode: HttpStatus.BAD_REQUEST,
        timestamp: new Date().toISOString(),
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
