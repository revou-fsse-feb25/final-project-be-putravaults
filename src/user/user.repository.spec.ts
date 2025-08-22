import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from './user.repository';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dtos/req/user.dto';
import { UserAlreadyExistsException } from './exceptions/user-already-exist.exception';
import { UserRepositoryException } from './exceptions/user-repository.exception';

// Mock Role enum
enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
}

describe('UserRepository', () => {
  let repository: UserRepository;
  let prismaService: jest.Mocked<PrismaService>;

  const mockUser = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    password: 'hashedPassword',
    role: Role.USER,
    registeredAt: new Date(),
  };

  beforeEach(async () => {
    const mockPrismaService = {
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRepository,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    repository = module.get<UserRepository>(UserRepository);
    prismaService = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('create', () => {
    const createUserDto: CreateUserDto = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    };

    it('should create a user successfully', async () => {
      prismaService.user.findUnique.mockResolvedValue(null);
      prismaService.user.create.mockResolvedValue(mockUser);

      const result = await repository.create(createUserDto);

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: createUserDto.email },
      });
      expect(prismaService.user.create).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });

    it('should throw UserAlreadyExistsException when user exists', async () => {
      prismaService.user.findUnique.mockResolvedValue(mockUser);

      await expect(repository.create(createUserDto)).rejects.toThrow(UserAlreadyExistsException);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: createUserDto.email },
      });
      expect(prismaService.user.create).not.toHaveBeenCalled();
    });

    it('should throw UserRepositoryException for database errors', async () => {
      prismaService.user.findUnique.mockResolvedValue(null);
      prismaService.user.create.mockRejectedValue(new Error('Database error'));

      await expect(repository.create(createUserDto)).rejects.toThrow(UserRepositoryException);
    });
  });

  describe('findUserByEmail', () => {
    it('should find user by email', async () => {
      prismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await repository.findUserByEmail('john@example.com');

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'john@example.com' },
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null when user not found', async () => {
      prismaService.user.findUnique.mockResolvedValue(null);

      const result = await repository.findUserByEmail('nonexistent@example.com');

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'nonexistent@example.com' },
      });
      expect(result).toBeNull();
    });
  });

  describe('findUserById', () => {
    it('should find user by id', async () => {
      prismaService.user.findUnique.mockResolvedValue(mockUser);

      const result = await repository.findUserById(1);

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null when user not found', async () => {
      prismaService.user.findUnique.mockResolvedValue(null);

      const result = await repository.findUserById(999);

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: 999 },
      });
      expect(result).toBeNull();
    });
  });
});
