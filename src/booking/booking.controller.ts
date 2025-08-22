import { 
    Body, 
    Controller, 
    Get, 
    Param, 
    ParseIntPipe, 
    Patch, 
    Post, 
    UseGuards,
    Request 
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dtos/req/create-booking.dto';
import { UpdateBookingDto } from './dtos/req/update-booking.dto';
import { BookingResponseDto } from './dtos/res/booking.response.dto';
import { BookingsListResponseDto } from './dtos/res/bookings-list.response.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { BookingUnauthorizedException } from './exceptions/booking-unauthorized.exception';

interface AuthenticatedRequest extends Request {
    user: {
        id: number;
        email: string;
        role: string;
    };
}

@Controller('booking')
@UseGuards(RolesGuard)
export class BookingController {
    constructor(private readonly bookingService: BookingService) {}

    @Post()
    @Roles('USER', 'ADMIN')
    createBooking(
        @Body() createBookingDto: CreateBookingDto,
        @Request() req: AuthenticatedRequest
    ): Promise<BookingResponseDto> {
        // Check if user is authenticated
        if (!req.user) {
            throw new BookingUnauthorizedException('User not authenticated');
        }
        
        // Ensure user can only create bookings for themselves
        if (createBookingDto.userId !== req.user.id && req.user.role !== 'ADMIN') {
            throw new BookingUnauthorizedException('You can only create bookings for yourself');
        }
        
        return this.bookingService.createBooking(createBookingDto);
    }
    
    @Roles('USER', 'ADMIN')
    @Get('user/:userId')
    getBookingsByUserId(
        @Param('userId', ParseIntPipe) userId: number,
        @Request() req: AuthenticatedRequest
    ): Promise<BookingsListResponseDto> {
        // Check if user is authenticated
        if (!req.user) {
            throw new BookingUnauthorizedException('User not authenticated');
        }
        
        // Ensure user can only view their own bookings (unless admin)
        if (userId !== req.user.id && req.user.role !== 'ADMIN') {
            throw new BookingUnauthorizedException('You can only view your own bookings');
        }
        
        return this.bookingService.getBookingsByUserId(userId);
    }

    @Get(':id')
    async getBookingById(
        @Param('id', ParseIntPipe) id: number,
        @Request() req: AuthenticatedRequest
    ): Promise<BookingResponseDto> {
        // Check if user is authenticated
        if (!req.user) {
            throw new BookingUnauthorizedException('User not authenticated');
        }
        
        const booking = await this.bookingService.getBookingById(id);
        
        // Ensure user can only view their own bookings (unless admin)
        if (booking.userId !== req.user.id && req.user.role !== 'ADMIN') {
            throw new BookingUnauthorizedException('You can only view your own bookings');
        }
        
        return booking;
    }

    @Patch(':id')
    @Roles('ADMIN')
    updateBooking(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateBookingDto: UpdateBookingDto
    ): Promise<BookingResponseDto> {
        return this.bookingService.updateBooking(id, updateBookingDto);
    }
    @Roles('USER', 'ADMIN')
    @Post(':id/cancel')
    async cancelBooking(
        @Param('id', ParseIntPipe) id: number,
        @Request() req: AuthenticatedRequest
    ): Promise<BookingResponseDto> {
        // Check if user is authenticated
        if (!req.user) {
            throw new BookingUnauthorizedException('User not authenticated');
        }
        
        const booking = await this.bookingService.getBookingById(id);
        
        // Ensure user can only cancel their own bookings (unless admin)
        if (booking.userId !== req.user.id && req.user.role !== 'ADMIN') {
            throw new BookingUnauthorizedException('You can only cancel your own bookings');
        }
        
        return this.bookingService.cancelBooking(id);
    }

    @Post(':id/confirm')
    async confirmBooking(
        @Param('id', ParseIntPipe) id: number,
        @Request() req: AuthenticatedRequest
    ): Promise<BookingResponseDto> {
        // Check if user is authenticated
        if (!req.user) {
            throw new BookingUnauthorizedException('User not authenticated');
        }
        
        const booking = await this.bookingService.getBookingById(id);
        
        // Ensure user can only confirm their own bookings (unless admin)
        if (booking.userId !== req.user.id && req.user.role !== 'ADMIN') {
            throw new BookingUnauthorizedException('You can only confirm your own bookings');
        }
        
        return this.bookingService.confirmBooking(id);
    }

    @Post('cleanup-expired')
    @Roles('ADMIN')
    cleanupExpiredBookings(): Promise<void> {
        return this.bookingService.cleanupExpiredBookings();
    }

    @Patch(':id/update-status')
    async updateBookingStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateStatusDto: { status: string }
    ): Promise<BookingResponseDto> {
        return this.bookingService.updateBookingStatus(id, updateStatusDto.status);
    }
}
