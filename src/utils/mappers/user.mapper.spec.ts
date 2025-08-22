import { UserMapper } from './user.mapper';

// Mock Role enum
enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
  MODERATOR = 'MODERATOR',
}

describe('UserMapper', () => {
  const mockUser = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    password: 'hashedPassword',
    role: Role.USER,
    registeredAt: new Date('2024-01-01'),
  };

  const mockUserWithoutPassword = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    role: Role.USER,
    registeredAt: new Date('2024-01-01'),
  };

  describe('mapToUserResponseDto', () => {
    it('should map user to UserResponseDto', () => {
      const result = UserMapper.mapToUserResponseDto(mockUser);

      expect(result).toEqual({
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        role: Role.USER,
        registeredAt: new Date('2024-01-01'),
      });
    });

    it('should handle null values', () => {
      const userWithNulls = {
        ...mockUser,
        name: null,
        role: null,
      };

      const result = UserMapper.mapToUserResponseDto(userWithNulls);

      expect(result).toEqual({
        id: 1,
        name: null,
        email: 'john@example.com',
        role: null,
        registeredAt: new Date('2024-01-01'),
      });
    });

    it('should exclude password from result', () => {
      const result = UserMapper.mapToUserResponseDto(mockUser);

      expect(result).not.toHaveProperty('password');
    });
  });

  describe('mapToUsersListResponseDto', () => {
    it('should map users array to UsersListResponseDto', () => {
      const users = [mockUser, { ...mockUser, id: 2, email: 'jane@example.com' }];

      const result = UserMapper.mapToUsersListResponseDto(users);

      expect(result).toEqual({
        users: [
          {
            id: 1,
            name: 'John Doe',
            email: 'john@example.com',
            role: Role.USER,
            registeredAt: new Date('2024-01-01'),
          },
          {
            id: 2,
            name: 'John Doe',
            email: 'jane@example.com',
            role: Role.USER,
            registeredAt: new Date('2024-01-01'),
          },
        ],
        total: 2,
      });
    });

    it('should handle empty array', () => {
      const result = UserMapper.mapToUsersListResponseDto([]);

      expect(result).toEqual({
        users: [],
        total: 0,
      });
    });
  });
});
