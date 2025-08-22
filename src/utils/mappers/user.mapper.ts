import { BaseMapper } from './base.mapper';
import { UserResponseDto } from '../../user/dtos/res/user.response.dto';
import { UsersListResponseDto } from '../../user/dtos/res/users-list.response.dto';

export class UserMapper extends BaseMapper {
  /**
   * Maps a single user entity to UserResponseDto
   * Excludes password for security
   */
  static mapToUserResponseDto(user: any): UserResponseDto {
    return this.mapToDto(UserResponseDto, user);
  }

  /**
   * Maps an array of users to UserResponseDto array
   */
  static mapToUserResponseDtoArray(users: any[]): UserResponseDto[] {
    return this.mapToDtoArray(UserResponseDto, users);
  }

  /**
   * Maps users array to UsersListResponseDto
   */
  static mapToUsersListResponseDto(users: any[]): UsersListResponseDto {
    return this.mapToDto(UsersListResponseDto, {
      users: this.mapToUserResponseDtoArray(users),
      total: users.length,
    });
  }

  /**
   * Maps user for public profile (safe fields only)
   */
  static mapToPublicUserProfile(user: any): Partial<UserResponseDto> {
    return {
      id: user.id,
      name: user.name,
      role: user.role,
      registeredAt: user.registeredAt,
      // Email is excluded from public profile
    };
  }
}
