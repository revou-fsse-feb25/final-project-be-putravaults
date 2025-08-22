import { HttpException, HttpStatus } from '@nestjs/common';

export class UserAlreadyExistsException extends HttpException {
  constructor(email: string) {
    super(
      {
        message: `User with email ${email} already exists`,
        error: 'User Already Exists',
        statusCode: HttpStatus.CONFLICT,
        timestamp: new Date().toISOString(),
        field: 'email',
      },
      HttpStatus.CONFLICT,
    );
  }
}