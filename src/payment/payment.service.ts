import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dtos/req/create-payment.dto';
import { PaymentCallbackRequestDto } from './dtos/req/payment-callback.dto';
const midtransClient = require('midtrans-client');
import * as crypto from 'crypto';
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

  async createPaymentWithBookingData(createPaymentDto: CreatePaymentDto, bookingData: any) {
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
        custom_field1: JSON.stringify(bookingData), // Store booking data for later processing
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
      fraud_status,
      status_code,
      gross_amount,
      signature_key,
      custom_field1,
    } = paymentCallbackRequestDto;

    const hash = crypto
      .createHash('sha512')
      .update(
        `${order_id}${status_code}${gross_amount}${process.env.MIDTRANS_SERVER_KEY}`,
      )
      .digest('hex');

    if (hash !== signature_key) {
      throw new Error('Missing or invalid midtrans signature key');
    }

    // Parse booking data from custom_field1
    let bookingData = null;
    if (custom_field1) {
      try {
        bookingData = JSON.parse(custom_field1);
      } catch (error) {
        console.error('Failed to parse booking data from custom_field1:', error);
      }
    }

    // Generate a unique order ID for this transaction
    const orderId = parseInt(order_id);

    if (transaction_status === 'capture') {
      if (fraud_status === 'accept') {
        // Create booking and confirm it
        if (bookingData) {
          await this.bookingRepository.updateBookingStatus(
            orderId,
            'CONFIRMED',
          );
        }
      } else if (fraud_status === 'reject') {
        await this.bookingRepository.cancelBooking(orderId);
        // Payment rejected - no booking created
        console.log(`Payment rejected for order: ${order_id}`);
      }
    } else if (transaction_status === 'settlement') {
      // Payment successful - create booking
      if (bookingData) {
        await this.bookingRepository.updateBookingStatus(orderId, 'CONFIRMED');
      }
    } else if (
      transaction_status === 'deny' ||
      transaction_status === 'expire' ||
      transaction_status === 'cancel'
    ) {
      this.bookingRepository.cancelBooking(parseInt(order_id));
      console.log(`Payment failed for order: ${order_id}`);
    } else if (transaction_status === 'pending') {
      const existingBooking = await this.bookingRepository.getBookingByOrderId(orderId);
      //create booking if not exist
      if (!existingBooking) {
        await this.bookingRepository.createBooking(orderId);
        console.log(`Created booking for pending order: ${order_id}`);
      }
    }

    return console.log('Payment callback handled successfully');
  }

  private async createBookingFromPaymentData(bookingData: any, orderId: string, status: string) {
    try {
      // Create the booking
      const booking = await this.bookingRepository.createBooking(bookingData.userId);

      // Process each ticket booking item
      for (const ticketItem of bookingData.tickets) {
        // Get available tickets for this ticket class
        const availableTickets = await this.ticketRepository.getAvailableTicketsByTicketClass(
          ticketItem.ticketClassId
        );

        // Check if we have enough tickets
        if (availableTickets.length < ticketItem.quantity) {
          throw new Error(
            `Insufficient tickets for ticket class ${ticketItem.ticketClassId}. Available: ${availableTickets.length}, Requested: ${ticketItem.quantity}`
          );
        }

        // Take the first N available tickets
        const ticketsToBook = availableTickets.slice(0, ticketItem.quantity);
        const ticketIds = ticketsToBook.map(ticket => ticket.id);

        // Update tickets to reference this booking
        await this.bookingRepository.updateTicketsBookingId(ticketIds, booking.id);
        
        // Update ticket status based on payment status
        const ticketStatus = status === 'CONFIRMED' ? 'SOLD' : 'AVAILABLE';
        await this.ticketRepository.updateTicketsStatus(ticketIds, ticketStatus);
      }

      // Update booking status
      await this.bookingRepository.updateBookingStatus(booking.id, status);

      console.log(`Booking created successfully: ${booking.id} for order: ${orderId}`);
    } catch (error) {
      console.error('Failed to create booking from payment data:', error);
      throw error;
    }
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
