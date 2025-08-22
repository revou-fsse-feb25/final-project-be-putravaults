import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { BookingRepository } from './booking.repository';
import { PrismaModule } from '../../prisma/prisma.module';
import { UserModule } from '../user/user.module';
import { TicketModule } from '../ticket/ticket.module';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [PrismaModule, UserModule, TicketModule, AuthModule],
    controllers: [BookingController],
    providers: [BookingService, BookingRepository],
    exports: [BookingService, BookingRepository],
})
export class BookingModule {}
