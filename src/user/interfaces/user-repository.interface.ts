import { CreateUserDto } from '../dtos/req/user.dto';

export interface IUserRepository {
  create(dto: CreateUserDto): Promise<any>;
  findUserByEmail(email: string): Promise<any | null>;
  findUserById(id: number): Promise<any | null>;
}
