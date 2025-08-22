import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dtos/req/create-payment.dto';

@Injectable()
export class PaymentService {
    private readonly MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY || 'Mid-server-EzmRo7KWjCxVsAy6W9RNaVBi';
    private readonly MIDTRANS_API_URL = 'https://api.sandbox.midtrans.com/v2';

    async createPayment(createPaymentDto: CreatePaymentDto) {
        try {
            console.log('Creating payment with data:', createPaymentDto);

            const response = await fetch(`${this.MIDTRANS_API_URL}/charge`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Basic ${Buffer.from(this.MIDTRANS_SERVER_KEY + ':').toString('base64')}`,
                },
                body: JSON.stringify({
                    payment_type: 'bank_transfer',
                    bank_transfer: {
                        bank: 'bca', // Default to BCA
                    },
                    transaction_details: {
                        order_id: createPaymentDto.orderId,
                        gross_amount: createPaymentDto.amount,
                    },
                    customer_details: {
                        first_name: createPaymentDto.customerName,
                        email: createPaymentDto.customerEmail,
                    },
                    item_details: createPaymentDto.itemDetails,
                }),
            });

            console.log('Midtrans API response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Midtrans API error response:', errorText);
                throw new Error(`Payment creation failed: ${response.status} - ${errorText}`);
            }

            const result = await response.json();
            console.log('Midtrans API success response:', result);

            return {
                success: true,
                data: result,
                redirect_url: result.redirect_url,
                va_numbers: result.va_numbers,
                order_id: result.order_id,
            };

        } catch (error) {
            console.error('Error creating payment:', error);
            throw new Error(`Failed to create payment: ${error.message}`);
        }
    }

    async checkPaymentStatus(orderId: string) {
        try {
            console.log('Checking payment status for order:', orderId);

            const response = await fetch(`${this.MIDTRANS_API_URL}/${orderId}/status`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Basic ${Buffer.from(this.MIDTRANS_SERVER_KEY + ':').toString('base64')}`,
                },
            });

            console.log('Midtrans status check response status:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Midtrans status check error response:', errorText);
                throw new Error(`Payment status check failed: ${response.status} - ${errorText}`);
            }

            const result = await response.json();
            console.log('Midtrans status check success response:', result);

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
            console.error('Error checking payment status:', error);
            throw new Error(`Failed to check payment status: ${error.message}`);
        }
    }
}
