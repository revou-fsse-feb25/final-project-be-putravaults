import { Test, TestingModule } from '@nestjs/testing';
import { BookingService } from './booking.service';
import { BookingRepository } from './booking.repository';
import { CreateBookingDto } from './dtos/req/create-booking.dto';
import { BookingResponseDto } from './dtos/res/booking.response.dto';
import { BookingsListResponseDto } from './dtos/res/bookings-list.response.dto';

describe('BookingService', () => {
  let service: BookingService;
  let bookingRepository: jest.Mocked<BookingRepository>;

  const mockBookingResponse: BookingResponseDto = {
    id: 1,
    userId: 1,
    eventId: 1,
    totalAmount: 200,
    status: 'PENDING',
    createdAt: new Date(),
    updatedAt: new Date(),
    tickets: [
      {
        id: 1,
        eventId: 1,
        ticketClassId: 1,
        seatNumber: 'A1',
        status: 'RESERVED',
      },
    ],
  };

  const mockBookingsListResponse: BookingsListResponseDto = {
    bookings: [mockBookingResponse],
    total: 1,
  };

  beforeEach(async () => {
    const mockBookingRepository = {
      createBooking: jest.fn(),
      getBookings: jest.fn(),
      getBookingById: jest.fn(),
      updateBooking: jest.fn(),
      deleteBooking: jest.fn(),
      getBookingsByUser: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingService,
        {
          provide: BookingRepository,
          useValue: mockBookingRepository,
        },
      ],
    }).compile();

    service = module.get<BookingService>(BookingService);
    bookingRepository = module.get(BookingRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createBooking', () => {
    const createBookingDto: CreateBookingDto = {
      userId: 1,
      eventId: 1,
      ticketIds: [1, 2],
      totalAmount: 200,
    };

    it('should create a booking successfully', async () => {
      bookingRepository.createBooking.mockResolvedValue(mockBookingResponse);

      const result = await service.createBooking(createBookingDto);

      expect(bookingRepository.createBooking).toHaveBeenCalledWith(createBookingDto);
      expect(result).toEqual(mockBookingResponse);
    });

    it('should handle service errors', async () => {
      const error = new Error('Booking creation failed');
      bookingRepository.createBooking.mockRejectedValue(error);

      await expect(service.createBooking(createBookingDto)).rejects.toThrow('Booking creation failed');
      expect(bookingRepository.createBooking).toHaveBeenCalledWith(createBookingDto);
    });
  });

  describe('getBookings', () => {
    it('should return all bookings', async () => {
      bookingRepository.getBookings.mockResolvedValue(mockBookingsListResponse);

      const result = await service.getBookings();

      expect(bookingRepository.getBookings).toHaveBeenCalled();
      expect(result).toEqual(mockBookingsListResponse);
    });
  });

  describe('getBookingById', () => {
    it('should return booking by id successfully', async () => {
      bookingRepository.getBookingById.mockResolvedValue(mockBookingResponse);

      const result = await service.getBookingById(1);

      expect(bookingRepository.getBookingById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockBookingResponse);
    });

    it('should handle service errors', async () => {
      const error = new Error('Booking not found');
      bookingRepository.getBookingById.mockRejectedValue(error);

      await expect(service.getBookingById(999)).rejects.toThrow('Booking not found');
      expect(bookingRepository.getBookingById).toHaveBeenCalledWith(999);
    });
  });

  describe('updateBooking', () => {
    const updateBookingDto = {
      status: 'CONFIRMED',
    };

    it('should update booking successfully', async () => {
      const mockUpdatedBooking = {
        ...mockBookingResponse,
        status: 'CONFIRMED',
      };

      bookingRepository.updateBooking.mockResolvedValue(mockUpdatedBooking);

      const result = await service.updateBooking(1, updateBookingDto);

      expect(bookingRepository.updateBooking).toHaveBeenCalledWith(1, updateBookingDto);
      expect(result).toEqual(mockUpdatedBooking);
    });

    it('should handle service errors', async () => {
      const error = new Error('Booking not found');
      bookingRepository.updateBooking.mockRejectedValue(error);

      await expect(service.updateBooking(999, updateBookingDto)).rejects.toThrow('Booking not found');
      expect(bookingRepository.updateBooking).toHaveBeenCalledWith(999, updateBookingDto);
    });
  });

  describe('deleteBooking', () => {
    it('should delete booking successfully', async () => {
      bookingRepository.deleteBooking.mockResolvedValue(undefined);

      await service.deleteBooking(1);

      expect(bookingRepository.deleteBooking).toHaveBeenCalledWith(1);
    });

    it('should handle service errors', async () => {
      const error = new Error('Booking not found');
      bookingRepository.deleteBooking.mockRejectedValue(error);

      await expect(service.deleteBooking(999)).rejects.toThrow('Booking not found');
      expect(bookingRepository.deleteBooking).toHaveBeenCalledWith(999);
    });
  });

  describe('getBookingsByUser', () => {
    it('should return bookings by user successfully', async () => {
      bookingRepository.getBookingsByUser.mockResolvedValue(mockBookingsListResponse);

      const result = await service.getBookingsByUser(1);

      expect(bookingRepository.getBookingsByUser).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockBookingsListResponse);
    });

    it('should handle service errors', async () => {
      const error = new Error('User not found');
      bookingRepository.getBookingsByUser.mockRejectedValue(error);

      await expect(service.getBookingsByUser(999)).rejects.toThrow('User not found');
      expect(bookingRepository.getBookingsByUser).toHaveBeenCalledWith(999);
    });
  });
});
