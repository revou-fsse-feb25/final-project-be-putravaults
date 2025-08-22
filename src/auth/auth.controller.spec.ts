import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/req/auth.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;

  const mockLoginResponse = {
    user: {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      role: 'USER',
      registeredAt: new Date(),
    },
    accessToken: 'access-token',
    refreshToken: 'refresh-token',
  };

  beforeEach(async () => {
    const mockAuthService = {
      login: jest.fn(),
      refreshToken: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    const loginDto: LoginDto = {
      email: 'john@example.com',
      password: 'password123',
    };

    it('should login successfully', async () => {
      authService.login.mockResolvedValue(mockLoginResponse);

      const result = await controller.login(loginDto);

      expect(authService.login).toHaveBeenCalledWith(loginDto);
      expect(result).toEqual(mockLoginResponse);
    });

    it('should handle service errors', async () => {
      const error = new Error('Invalid credentials');
      authService.login.mockRejectedValue(error);

      await expect(controller.login(loginDto)).rejects.toThrow('Invalid credentials');
      expect(authService.login).toHaveBeenCalledWith(loginDto);
    });
  });

  describe('refreshToken', () => {
    const mockUser = {
      email: 'john@example.com',
      role: 'USER',
      id: 1,
      sub: {
        name: 'John Doe',
      },
    };

    const mockRefreshResponse = {
      accessToken: 'new-access-token',
      refreshToken: 'new-refresh-token',
    };

    it('should refresh token successfully', async () => {
      authService.refreshToken.mockResolvedValue(mockRefreshResponse);

      const result = await controller.refreshToken(mockUser);

      expect(authService.refreshToken).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockRefreshResponse);
    });

    it('should handle service errors', async () => {
      const error = new Error('Invalid refresh token');
      authService.refreshToken.mockRejectedValue(error);

      await expect(controller.refreshToken(mockUser)).rejects.toThrow('Invalid refresh token');
      expect(authService.refreshToken).toHaveBeenCalledWith(mockUser);
    });
  });
});
