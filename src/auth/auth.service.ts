import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dtos/req/auth.dto';
import { UserService } from 'src/user/user.service';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { jwtPayload } from './entities/payload.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    try {
      const user = await this.validateUser(dto);
      const payload = {
        email: user.email,
        role: user.role,
        id: user.id,
        sub: {
          name: user.name,
        },
      };
      return {
        user,
        ...(await this.generateToken(payload)),
      };
    } catch (error) {
      throw error;
    }
  }

  async generateToken(payload:jwtPayload) {
    const [accessToken, refreshToken] = await Promise.all([

      this.jwtService.signAsync(payload, {
        expiresIn: '1h',
        secret: process.env.jwtSecretKey,
      }),

      this.jwtService.signAsync(payload, {
        expiresIn: '7d',
        secret: process.env.jwtRefreshTokenKey,
      })
    ])
    return {accessToken, refreshToken}
  }

  async validateUser(dto: LoginDto) {
    const user = await this.userService.findByEmail(dto.email);
    if (user && (await compare(dto.password, user.password))) {
      const { password, ...result } = user;
      return result;
    }

    throw new UnauthorizedException();
  }

  async refreshToken(user:any) {
    const payload = {
      email: user.email,
      role: user.role,
      id: user.id,
      sub: user.sub
    };

    return {
      ...(await this.generateToken(payload)),
    };
  } 
}
