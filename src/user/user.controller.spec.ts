import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/req/user.dto';
import { UserResponseDto } from './dtos/res/user.response.dto';

// Mock Role enum
enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
}

describe('UserController', () => {
  let controller: UserController;
  let userService: jest.Mocked<UserService>;

  const mockUserResponseDto: UserResponseDto = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    role: Role.USER,
    registeredAt: new Date(),
  };

  beforeEach(async () => {
    const mockUserService = {
      createUser: jest.fn(),
      findById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createUser', () => {
    const createUserDto: CreateUserDto = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    };

    it('should create a user successfully', async () => {
      userService.createUser.mockResolvedValue(mockUserResponseDto);

      const result = await controller.createUser(createUserDto);

      expect(userService.createUser).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(mockUserResponseDto);
    });

    it('should handle service errors', async () => {
      const error = new Error('Service error');
      userService.createUser.mockRejectedValue(error);

      await expect(controller.createUser(createUserDto)).rejects.toThrow('Service error');
      expect(userService.createUser).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('getUserById', () => {
    it('should return user by id successfully', async () => {
      userService.findById.mockResolvedValue(mockUserResponseDto);

      const result = await controller.getUserById(1);

      expect(userService.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockUserResponseDto);
    });

    it('should handle service errors', async () => {
      const error = new Error('User not found');
      userService.findById.mockRejectedValue(error);

      await expect(controller.getUserById(999)).rejects.toThrow('User not found');
      expect(userService.findById).toHaveBeenCalledWith(999);
    });
  });
});
