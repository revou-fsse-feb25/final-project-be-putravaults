import { Booking, Ticket, TicketClass, Event, User } from '@prisma/client';
import { BookingResponseDto, BookingTicketDto } from '../../booking/dtos/res/booking.response.dto';
import { BookingsListResponseDto } from '../../booking/dtos/res/bookings-list.response.dto';

type BookingWithDetails = Booking & {
    tickets: (Ticket & {
        ticketClass: TicketClass;
        event: Event;
    })[];
    user?: Pick<User, 'id' | 'name' | 'email'>;
};

export class BookingMapper {
    static mapToBookingResponseDto(booking: BookingWithDetails): BookingResponseDto {
        const totalAmount = booking.tickets.reduce((sum, ticket) => {
            return sum + Number(ticket.ticketClass.price);
        }, 0);

        const tickets: BookingTicketDto[] = booking.tickets.map(ticket => ({
            id: ticket.id,
            seatNumber: ticket.seatNumber || undefined,
            status: ticket.status,
            ticketClass: {
                id: ticket.ticketClass.id,
                name: ticket.ticketClass.name,
                price: Number(ticket.ticketClass.price),
            },
            event: {
                id: ticket.event.id,
                name: ticket.event.name,
                date: ticket.event.date.toISOString(),
                location: ticket.event.location,
            },
        }));

        return {
            id: booking.id,
            userId: booking.userId,
            status: booking.status,
            paymentId: booking.paymentId || undefined,
            totalAmount,
            createdAt: booking.createdAt.toISOString(),
            updatedAt: booking.updatedAt.toISOString(),
            tickets,
        };
    }

    static mapToBookingsListResponseDto(
        bookings: BookingWithDetails[],
        userId?: number
    ): BookingsListResponseDto {
        const mappedBookings = bookings.map(booking => 
            this.mapToBookingResponseDto(booking)
        );

        return {
            bookings: mappedBookings,
            total: bookings.length,
            userId,
        };
    }
}
