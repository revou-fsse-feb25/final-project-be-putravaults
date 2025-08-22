import { Module } from '@nestjs/common';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { EventRepository } from './event.repository';
import { PrismaService } from 'prisma/prisma.service';

@Module({
  controllers: [EventController],
  providers: [EventService, EventRepository, PrismaService],
  exports: [EventService, EventRepository]
})
export class EventModule {}
