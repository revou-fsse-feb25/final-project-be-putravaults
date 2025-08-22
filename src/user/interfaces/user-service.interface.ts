import { CreateUserDto } from '../dtos/req/user.dto';
import { UserResponseDto } from '../dtos/res/user.response.dto';

export interface IUserService {
  createUser(dto: CreateUserDto): Promise<UserResponseDto>;
  findByEmail(email: string): Promise<any>;
  findById(id: number): Promise<UserResponseDto>;
}
