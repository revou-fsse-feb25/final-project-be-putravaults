import { InternalServerErrorException } from '@nestjs/common';

export class UserRepositoryException extends InternalServerErrorException {
  constructor(message: string) {
    super(`UserRepository error: ${message}`);
  }
}
