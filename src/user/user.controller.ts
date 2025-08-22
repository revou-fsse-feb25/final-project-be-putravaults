import { Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResponseDto } from './dtos/res/user.response.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@UseGuards(RolesGuard)
@Controller('user')
export class UserController {
    constructor (
        private userService:UserService
    ) {}

    @Roles('USER', 'ADMIN')
    @Get(':id')
    async getUserProfile(@Param("id", ParseIntPipe) id: number): Promise<UserResponseDto> {
        return await this.userService.findById(id);
    }
}
 