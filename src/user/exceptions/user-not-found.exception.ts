import { HttpException, HttpStatus } from '@nestjs/common';

export class UserNotFoundException extends HttpException {
  constructor(identifier: string | number) {
    super(
      {
        message: `User with ${typeof identifier === 'string' ? 'email' : 'ID'} ${identifier} not found`,
        error: 'User Not Found',
        statusCode: HttpStatus.NOT_FOUND,
        timestamp: new Date().toISOString(),
      },
      HttpStatus.NOT_FOUND,
    );
  }
}
