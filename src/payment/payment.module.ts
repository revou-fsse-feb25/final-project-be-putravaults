import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { BookingRepository } from '../booking/booking.repository';
import { TicketRepository } from '../ticket/ticket.repository';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
    controllers: [PaymentController],
    providers: [PaymentService, BookingRepository, TicketRepository, PrismaService],
    exports: [PaymentService],
})
export class PaymentModule {}
