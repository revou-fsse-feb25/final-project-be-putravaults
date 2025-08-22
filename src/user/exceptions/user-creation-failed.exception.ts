import { HttpException, HttpStatus } from '@nestjs/common';

export class UserCreationFailedException extends HttpException {
  constructor(reason?: string) {
    super(
      {
        message: `Failed to create user${reason ? `: ${reason}` : ''}`,
        error: 'User Creation Failed',
        statusCode: HttpStatus.BAD_REQUEST,
        timestamp: new Date().toISOString(),
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
