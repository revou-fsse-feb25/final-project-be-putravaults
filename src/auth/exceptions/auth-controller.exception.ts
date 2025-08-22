import { InternalServerErrorException } from '@nestjs/common';

export class AuthControllerException extends InternalServerErrorException {
  constructor(message: string) {
    super(`UserController error: ${message}`);
  }
}
