import { InternalServerErrorException } from '@nestjs/common';

export class UserServiceException extends InternalServerErrorException {
  constructor(message: string) {
    super(`UserService error: ${message}`);
  }
}
