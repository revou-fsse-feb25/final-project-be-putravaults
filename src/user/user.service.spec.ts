import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dtos/req/user.dto';
import { UserResponseDto } from './dtos/res/user.response.dto';
import { UserAlreadyExistsException } from './exceptions/user-already-exist.exception';
import { UserNotFoundException } from './exceptions/user-not-found.exception';
import { UserCreationFailedException } from './exceptions/user-creation-failed.exception';
import { UserServiceException } from './exceptions/user-service.exception';

// Import Role enum from Prisma
enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
}

describe('UserService', () => {
  let service: UserService;
  let userRepository: jest.Mocked<UserRepository>;

  const mockUser = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    password: 'hashedPassword',
    role: Role.USER,
    registeredAt: new Date(),
  };

  const mockUserResponseDto: UserResponseDto = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    role: Role.USER,
    registeredAt: new Date(),
  };

  beforeEach(async () => {
    const mockUserRepository = {
      create: jest.fn(),
      findUserByEmail: jest.fn(),
      findUserById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get(UserRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    const createUserDto: CreateUserDto = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    };

    it('should create a user successfully', async () => {
      userRepository.create.mockResolvedValue(mockUser);

      const result = await service.createUser(createUserDto);

      expect(userRepository.create).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(mockUserResponseDto);
    });

    it('should throw UserAlreadyExistsException when user already exists', async () => {
      const error = new UserAlreadyExistsException('john@example.com');
      userRepository.create.mockRejectedValue(error);

      await expect(service.createUser(createUserDto)).rejects.toThrow(UserAlreadyExistsException);
      expect(userRepository.create).toHaveBeenCalledWith(createUserDto);
    });

    it('should throw UserCreationFailedException for unknown errors', async () => {
      const error = new Error('Database connection failed');
      userRepository.create.mockRejectedValue(error);

      await expect(service.createUser(createUserDto)).rejects.toThrow(UserCreationFailedException);
      expect(userRepository.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('findByEmail', () => {
    it('should find user by email', async () => {
      userRepository.findUserByEmail.mockResolvedValue(mockUser);

      const result = await service.findByEmail('john@example.com');

      expect(userRepository.findUserByEmail).toHaveBeenCalledWith('john@example.com');
      expect(result).toEqual(mockUser);
    });
  });

  describe('findById', () => {
    it('should find user by id successfully', async () => {
      userRepository.findUserById.mockResolvedValue(mockUser);

      const result = await service.findById(1);

      expect(userRepository.findUserById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockUserResponseDto);
    });

    it('should throw UserNotFoundException when user not found', async () => {
      userRepository.findUserById.mockResolvedValue(null);

      await expect(service.findById(999)).rejects.toThrow(UserNotFoundException);
      expect(userRepository.findUserById).toHaveBeenCalledWith(999);
    });

    it('should throw UserServiceException for repository errors', async () => {
      const error = new Error('Database error');
      userRepository.findUserById.mockRejectedValue(error);

      await expect(service.findById(1)).rejects.toThrow(UserServiceException);
      expect(userRepository.findUserById).toHaveBeenCalledWith(1);
    });
  });
});
