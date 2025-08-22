import { Test, TestingModule } from '@nestjs/testing';
import { TicketService } from './ticket.service';
import { TicketRepository } from './ticket.repository';
import { ReserveTicketsDto } from './dtos/req/reserve-tickets.dto';
import { ReserveTicketsResponseDto } from './dtos/res/reserve-tickets.response.dto';
import { TicketAvailabilityResponseDto } from './dtos/res/ticket-availability.response.dto';

describe('TicketService', () => {
  let service: TicketService;
  let ticketRepository: jest.Mocked<TicketRepository>;

  const mockReserveTicketsResponse: ReserveTicketsResponseDto = {
    success: true,
    message: 'Tickets reserved successfully',
    reservedTickets: [
      {
        id: 1,
        eventId: 1,
        ticketClassId: 1,
        seatNumber: 'A1',
        status: 'RESERVED',
      },
    ],
  };

  const mockTicketAvailability: TicketAvailabilityResponseDto = {
    eventId: 1,
    ticketClasses: [
      {
        id: 1,
        name: 'VIP',
        description: 'VIP tickets',
        price: 100,
        totalCount: 50,
        soldCount: 10,
        availableCount: 40,
      },
    ],
  };

  beforeEach(async () => {
    const mockTicketRepository = {
      reserveTickets: jest.fn(),
      getTicketAvailability: jest.fn(),
      updateTicket: jest.fn(),
      getTicketsByEvent: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TicketService,
        {
          provide: TicketRepository,
          useValue: mockTicketRepository,
        },
      ],
    }).compile();

    service = module.get<TicketService>(TicketService);
    ticketRepository = module.get(TicketRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('reserveTickets', () => {
    const reserveTicketsDto: ReserveTicketsDto = {
      eventId: 1,
      ticketClassId: 1,
      quantity: 2,
    };

    it('should reserve tickets successfully', async () => {
      ticketRepository.reserveTickets.mockResolvedValue(mockReserveTicketsResponse);

      const result = await service.reserveTickets(reserveTicketsDto);

      expect(ticketRepository.reserveTickets).toHaveBeenCalledWith(reserveTicketsDto);
      expect(result).toEqual(mockReserveTicketsResponse);
    });

    it('should handle service errors', async () => {
      const error = new Error('Insufficient tickets');
      ticketRepository.reserveTickets.mockRejectedValue(error);

      await expect(service.reserveTickets(reserveTicketsDto)).rejects.toThrow('Insufficient tickets');
      expect(ticketRepository.reserveTickets).toHaveBeenCalledWith(reserveTicketsDto);
    });
  });

  describe('getTicketAvailability', () => {
    it('should return ticket availability successfully', async () => {
      ticketRepository.getTicketAvailability.mockResolvedValue(mockTicketAvailability);

      const result = await service.getTicketAvailability(1);

      expect(ticketRepository.getTicketAvailability).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockTicketAvailability);
    });

    it('should handle service errors', async () => {
      const error = new Error('Event not found');
      ticketRepository.getTicketAvailability.mockRejectedValue(error);

      await expect(service.getTicketAvailability(999)).rejects.toThrow('Event not found');
      expect(ticketRepository.getTicketAvailability).toHaveBeenCalledWith(999);
    });
  });

  describe('updateTicket', () => {
    const updateTicketDto = {
      status: 'SOLD',
    };

    it('should update ticket successfully', async () => {
      const mockUpdatedTicket = {
        id: 1,
        eventId: 1,
        ticketClassId: 1,
        seatNumber: 'A1',
        status: 'SOLD',
      };

      ticketRepository.updateTicket.mockResolvedValue(mockUpdatedTicket);

      const result = await service.updateTicket(1, updateTicketDto);

      expect(ticketRepository.updateTicket).toHaveBeenCalledWith(1, updateTicketDto);
      expect(result).toEqual(mockUpdatedTicket);
    });

    it('should handle service errors', async () => {
      const error = new Error('Ticket not found');
      ticketRepository.updateTicket.mockRejectedValue(error);

      await expect(service.updateTicket(999, updateTicketDto)).rejects.toThrow('Ticket not found');
      expect(ticketRepository.updateTicket).toHaveBeenCalledWith(999, updateTicketDto);
    });
  });

  describe('getTicketsByEvent', () => {
    it('should return tickets by event successfully', async () => {
      const mockTickets = [
        {
          id: 1,
          eventId: 1,
          ticketClassId: 1,
          seatNumber: 'A1',
          status: 'AVAILABLE',
        },
      ];

      ticketRepository.getTicketsByEvent.mockResolvedValue(mockTickets);

      const result = await service.getTicketsByEvent(1);

      expect(ticketRepository.getTicketsByEvent).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockTickets);
    });

    it('should handle service errors', async () => {
      const error = new Error('Event not found');
      ticketRepository.getTicketsByEvent.mockRejectedValue(error);

      await expect(service.getTicketsByEvent(999)).rejects.toThrow('Event not found');
      expect(ticketRepository.getTicketsByEvent).toHaveBeenCalledWith(999);
    });
  });
});
