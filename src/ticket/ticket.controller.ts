import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ReserveTicketsDto } from './dtos/req/reserve-tickets.dto';
import { UpdateTicketDto } from './dtos/req/update-ticket.dto';
import { CreateTicketDto } from './dtos/req/create-ticket.dto';
import { TicketResponseDto } from './dtos/res/ticket.response.dto';
import { TicketsListResponseDto } from './dtos/res/tickets-list.response.dto';
import { TicketAvailabilityResponseDto } from './dtos/res/ticket-availability.response.dto';
import { ReserveTicketsResponseDto } from './dtos/res/reserve-tickets.response.dto';
import { TicketService } from './ticket.service';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@UseGuards(RolesGuard)
@Controller('ticket')
export class TicketController {
    constructor(private readonly ticketService: TicketService) {}

    @Get('event/:eventId')
    getTicketsByEvent(
        @Param('eventId', ParseIntPipe) eventId: number
    ): Promise<TicketsListResponseDto> {
        return this.ticketService.getTicketsByEvent(eventId);
    }

    @Get('event/:eventId/availability')
    getTicketAvailabilityByEvent(
        @Param('eventId', ParseIntPipe) eventId: number
    ): Promise<TicketAvailabilityResponseDto> {
        return this.ticketService.getTicketAvailabilityByEvent(eventId);
    }

    @Get('ticket-class/:ticketClassId')
    getTicketsByTicketClass(
        @Param('ticketClassId', ParseIntPipe) ticketClassId: number
    ): Promise<TicketsListResponseDto> {
        return this.ticketService.getTicketsByTicketClass(ticketClassId);
    }

    @Get(':id')
    getTicketById(
        @Param('id', ParseIntPipe) id: number
    ): Promise<TicketResponseDto> {
        return this.ticketService.getTicketById(id);
    }

    @Post('reserve')
    reserveTickets(
        @Body() reserveTicketsDto: ReserveTicketsDto
    ): Promise<ReserveTicketsResponseDto> {
        return this.ticketService.reserveTickets(reserveTicketsDto);
    }

    @Patch(':id')
    @UseGuards(RolesGuard)
    @Roles('ADMIN')
    updateTicket(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateTicketDto: UpdateTicketDto
    ): Promise<TicketResponseDto> {
        return this.ticketService.updateTicket(id, updateTicketDto);
    }

    @Post('release-expired')

    @Roles('ADMIN')
    releaseExpiredReservations(): Promise<void> {
        return this.ticketService.releaseExpiredReservations();
    }

    @Post('create')
    @UseGuards(RolesGuard)
    @Roles('ADMIN')
    createTicket(@Body() createTicketDto: CreateTicketDto): Promise<TicketResponseDto> {
        return this.ticketService.createTicket(createTicketDto);
    }
}
