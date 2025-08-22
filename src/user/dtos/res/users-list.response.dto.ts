import { Expose, Type } from 'class-transformer';
import { UserResponseDto } from './user.response.dto';

export class UsersListResponseDto {
    @Expose()
    @Type(() => UserResponseDto)
    users: UserResponseDto[];

    @Expose()
    total: number;
}
