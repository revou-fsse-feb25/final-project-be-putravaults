import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dtos/req/user.dto';
import { UserResponseDto } from './dtos/res/user.response.dto';
import { UserAlreadyExistsException } from './exceptions/user-already-exist.exception';
import { UserServiceException } from './exceptions/user-service.exception';
import { UserRepository } from './user.repository';
import { UserRepositoryException } from './exceptions/user-repository.exception';
import { UserNotFoundException } from './exceptions/user-not-found.exception';
import { UserCreationFailedException } from './exceptions/user-creation-failed.exception';
import { IUserService } from './interfaces/user-service.interface';
import { UserMapper } from '../utils/mappers/user.mapper';

@Injectable()
export class UserService implements IUserService {
    constructor (
        private userRepository:UserRepository 
    ) {}
    

    async createUser(dto: CreateUserDto): Promise<UserResponseDto> {
        try {
            const user = await this.userRepository.create(dto);
            return UserMapper.mapToUserResponseDto(user);
        } catch (error) {
            if (error instanceof UserAlreadyExistsException) {
                throw error;
            }
            if (error instanceof UserRepositoryException) {
                throw error;
            }
            
            // Handle other errors
            const message = error.message || 'Unknown error occurred';
            throw new UserCreationFailedException(message);
        }
    }

    async findByEmail(email:string) {
        return await this.userRepository.findUserByEmail(email)
    }

    async findById(id: number): Promise<UserResponseDto> {
        try {
            const user = await this.userRepository.findUserById(id);
            
            if (!user) {
                throw new UserNotFoundException(id);
            }
            
            return UserMapper.mapToUserResponseDto(user);
        } catch (error) {
            if (error instanceof UserNotFoundException) {
                throw error;
            }
            
            // Handle other errors
            const message = error.message || 'Unknown error occurred';
            throw new UserServiceException(message);
        }
    }

}
