import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { CreateEventDto } from './dtos/req/create.event.dto';
import { UpdateEventDto } from './dtos/req/update.event.dto';
import { EventResponseDto } from './dtos/res/event.response.dto';
import { EventsListResponseDto } from './dtos/res/events-list.response.dto';
import { TicketClassesListResponseDto } from './dtos/res/ticket-classes-list.response.dto';
import { EventService } from './event.service';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('event')
export class EventController {
    constructor(private readonly eventService: EventService) {}

    @Get('all')
    @UseGuards(RolesGuard)
    @Roles('ADMIN')
    getEvents(): Promise<EventsListResponseDto> {
        return this.eventService.getEvents();
    }

    @Get('upcoming')
    getUpcomingEvents(): Promise<EventsListResponseDto> {
        return this.eventService.getUpcomingEvents();
    }

    @Get(':id')
    getEventById(@Param('id', ParseIntPipe) id: number): Promise<EventResponseDto> {
        return this.eventService.getEventById(id);
    }

    @Get(':id/ticket-classes')
    getEventTicketClasses(
        @Param('id', ParseIntPipe) id: number
    ): Promise<TicketClassesListResponseDto> {
        return this.eventService.getEventTicketClasses(id);
    }

    @Post('create')
    @UseGuards(RolesGuard)
    @Roles('ADMIN')
    createEvent(@Body() createEventDto: CreateEventDto): Promise<EventResponseDto> {
        return this.eventService.createEvent(createEventDto);
    }

    @Patch(':id')
    @UseGuards(RolesGuard)
    @Roles('ADMIN')
    updateEvent(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateEventDto: UpdateEventDto
    ): Promise<EventResponseDto> {
        return this.eventService.updateEvent(id, updateEventDto);
    }

    @Delete(':id')
    @UseGuards(RolesGuard)
    @Roles('ADMIN')
    deleteEvent(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.eventService.deleteEvent(id);
    }
}
