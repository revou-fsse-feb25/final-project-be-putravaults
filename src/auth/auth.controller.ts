import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CreateUserDto } from 'src/user/dtos/req/user.dto';
import { UserAlreadyExistsException } from 'src/user/exceptions/user-already-exist.exception';
import { UserRepositoryException } from 'src/user/exceptions/user-repository.exception';
import { AuthControllerException } from './exceptions/auth-controller.exception';
import { LoginDto } from './dtos/req/auth.dto';
import { AuthService } from './auth.service';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RefreshJwtGuard } from './guards/refresh.guard';

@UseGuards(RolesGuard)
@Controller('auth')
export class AuthController {
    constructor(
        private userService:UserService,
        private authService:AuthService
    ) {}

    @Post('register')
    async registerUser(@Body() dto:CreateUserDto){
        try{
        return await this.userService.createUser(dto)
        }
        catch (error) {
            if (error instanceof UserAlreadyExistsException) throw error
            if (error instanceof UserRepositoryException) throw error
            if (error instanceof UserRepositoryException) throw error
            throw new AuthControllerException(error.message)
        }
            
    }

    @Post('login')
    async login(@Body() dto:LoginDto){
        return await this.authService.login(dto)
    }

    @UseGuards(RefreshJwtGuard)
    @Post('refresh')
    async refreshToken(@Request() req) {
        return await this.authService.refreshToken(req)
    }
}

