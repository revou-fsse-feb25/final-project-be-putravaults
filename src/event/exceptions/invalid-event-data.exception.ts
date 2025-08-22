import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidEventDataException extends HttpException {
  constructor(field: string, reason: string) {
    super(
      {
        message: `Invalid event data for field '${field}': ${reason}`,
        error: 'Invalid Event Data',
        statusCode: HttpStatus.BAD_REQUEST,
        timestamp: new Date().toISOString(),
        field: field,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
