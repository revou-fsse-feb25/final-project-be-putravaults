import { Expose } from 'class-transformer';

export class UserResponseDto {
    @Expose()
    id: number;

    @Expose()
    name: string | null;

    @Expose()
    email: string;

    @Expose()
    role: string | null;

    @Expose()
    registeredAt: Date;

    // Note: password is deliberately excluded for security
}
