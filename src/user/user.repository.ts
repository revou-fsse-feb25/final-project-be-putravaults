import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dtos/req/user.dto';
import {hash} from "bcrypt"
import { UserAlreadyExistsException } from './exceptions/user-already-exist.exception';
import { UserRepositoryException } from './exceptions/user-repository.exception';
import { IUserRepository } from './interfaces/user-repository.interface';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    try {
      if (user) throw new UserAlreadyExistsException(dto.email);

      const newUser = await this.prisma.user.create({
        data: {
          ...dto,
          password: await hash(dto.password, 10),
        },
      });

      const { password, ...result } = newUser;

      return result;
    } catch (error) {
      if (error instanceof UserAlreadyExistsException) throw error;
      throw new UserRepositoryException(error.message);
    }
  }

  async findUserByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
  }

  async findUserById(id: number) {
    return await this.prisma.user.findUnique({
      where: {
        id: id
      },
    });
  }
}
