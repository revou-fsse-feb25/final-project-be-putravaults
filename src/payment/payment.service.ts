import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dtos/req/create-payment.dto';
import { PaymentCallbackRequestDto } from './dtos/req/payment-callback.dto';
const midtransClient = require('midtrans-client');
import crypto from 'crypto';
import { BookingRepository } from '../booking/booking.repository';
import { TicketRepository } from '../ticket/ticket.repository';

@Injectable()
export class PaymentService {
  private readonly MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY;
  private readonly MIDTRANS_CLIENT_KEY = process.env.MIDTRANS_CLIENT_KEY;
  private readonly MIDTRANS_API_URL = 'https://api.sandbox.midtrans.com/v2';

  private readonly snap: any;

  constructor(
    private readonly bookingRepository: BookingRepository,
    private readonly ticketRepository: TicketRepository,
  ) {
    this.snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: this.MIDTRANS_SERVER_KEY,
      clientKey: this.MIDTRANS_CLIENT_KEY,
    });
  }

  async createPayment(createPaymentDto: CreatePaymentDto) {
    try {
      // Validate that gross_amount matches the sum of item_details
      const calculatedAmount = createPaymentDto.itemDetails.reduce(
        (sum, item) => {
          return sum + item.price * item.quantity;
        },
        0,
      );

      if (calculatedAmount !== createPaymentDto.amount) {
        throw new Error(
          `Amount mismatch: calculated ${calculatedAmount}, provided ${createPaymentDto.amount}`,
        );
      }

      // Validate and truncate item names length (Midtrans limit is 50 characters)
      for (const item of createPaymentDto.itemDetails) {
        if (item.name && item.name.length > 50) {
          item.name = item.name.substring(0, 47) + '...';
        }
      }

      const payment = {
        transaction_details: {
          order_id: createPaymentDto.orderId,
          gross_amount: createPaymentDto.amount,
        },
        credit_card: {
          secure: true,
        },
        customer_details: {
          first_name: createPaymentDto.customerName,
          email: createPaymentDto.customerEmail,
        },
        item_details: createPaymentDto.itemDetails,
      };

      const token = await this.snap.createTransaction(payment);

      if (!token || !token.token) {
        throw new Error(
          `Payment creation failed: Invalid response from Midtrans`,
        );
      }

      return { token: token.token };
    } catch (error) {
      throw new Error(`Failed to create payment: ${error.message}`);
    }
  }

  async handleCallback(paymentCallbackRequestDto: PaymentCallbackRequestDto) {
    const {
      order_id,
      transaction_status,
      payment_type,
      fraud_status,
      statusCode,
      gross_amount,
      signature_key,
    } = paymentCallbackRequestDto;

    const hash = crypto
      .createHash('sha512')
      .update(
        `${order_id}${statusCode}${gross_amount}${process.env.MIDTRANS_SERVER_KEY}`,
      )
      .digest('hex');

    if (hash !== signature_key) {
      throw new Error('Missing or invalid midtrans signature key');
    }

    // Extract booking ID from order_id (ORDER-175 -> 175)
    const bookingId = parseInt(order_id.replace('ORDER-', ''));

    if (isNaN(bookingId)) {
      throw new Error(`Invalid order_id format: ${order_id}`);
    }

    // Get booking with tickets to find associated ticket IDs
    const booking =
      await this.bookingRepository.getBookingWithTickets(bookingId);
    if (!booking) {
      throw new Error(`Booking not found for order_id: ${order_id}`);
    }

    const ticketIds = booking.tickets.map((ticket) => ticket.id);

    if (transaction_status === 'capture') {
      if (fraud_status === 'accept') {
        // Update booking status to CONFIRMED
        await this.bookingRepository.updateBookingStatus(
          bookingId,
          'CONFIRMED',
        );
        // Update ticket status to SOLD
        await this.ticketRepository.updateTicketsStatus(ticketIds, 'SOLD');
      } else if (fraud_status === 'reject') {
        // Update booking status to CANCELLED
        await this.bookingRepository.updateBookingStatus(
          bookingId,
          'CANCELLED',
        );
        // Release tickets back to AVAILABLE
        await this.ticketRepository.updateTicketsStatus(ticketIds, 'AVAILABLE');
        await this.bookingRepository.releaseTicketsFromBooking(bookingId);
      }
    } else if (transaction_status === 'settlement') {
      // Payment successful
      await this.bookingRepository.updateBookingStatus(bookingId, 'CONFIRMED');
      await this.ticketRepository.updateTicketsStatus(ticketIds, 'SOLD');
    } else if (
      transaction_status === 'deny' ||
      transaction_status === 'expire' ||
      transaction_status === 'cancel'
    ) {
      // Payment failed
      await this.bookingRepository.updateBookingStatus(bookingId, 'CANCELLED');
      await this.ticketRepository.updateTicketsStatus(ticketIds, 'AVAILABLE');
      await this.bookingRepository.releaseTicketsFromBooking(bookingId);
    }

    return;
  }

  async checkPaymentStatus(orderId: string) {
    try {
      const response = await fetch(
        `${this.MIDTRANS_API_URL}/${orderId}/status`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            Authorization: `Basic ${Buffer.from(this.MIDTRANS_SERVER_KEY + ':').toString('base64')}`,
          },
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Payment status check failed: ${response.status} - ${errorText}`,
        );
      }

      const result = await response.json();

      return {
        success: true,
        data: result,
        transaction_status: result.transaction_status,
        fraud_status: result.fraud_status,
        order_id: result.order_id,
        gross_amount: result.gross_amount,
        payment_type: result.payment_type,
        transaction_time: result.transaction_time,
        va_numbers: result.va_numbers,
      };
    } catch (error) {
      throw new Error(`Failed to check payment status: ${error.message}`);
    }
  }
}
