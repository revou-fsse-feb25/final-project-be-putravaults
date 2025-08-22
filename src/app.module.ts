import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { EventModule } from './event/event.module';
import { TicketModule } from './ticket/ticket.module';
import { BookingModule } from './booking/booking.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule, 
    PrismaModule, 
    AuthModule, 
    EventModule, 
    TicketModule, 
    BookingModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
