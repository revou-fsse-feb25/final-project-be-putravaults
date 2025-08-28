import { BookingStatus } from '@prisma/client';

export interface BookingTicketDto {
    id: number;
    seatNumber?: string;
    status: string;
    ticketClass: {
        id: number;
        name: string;
        price: number;
    };
    event: {
        id: number;
        name: string;
        date: string;
        location: string;
    };
}

export interface BookingResponseDto {
    id: number;
    userId: number;
    status: BookingStatus;
    totalAmount: number;
    createdAt: string;
    updatedAt: string;
    paymentId?: string;
    tickets: BookingTicketDto[];
}
