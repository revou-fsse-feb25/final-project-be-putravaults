import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dtos/req/create-payment.dto';
const midtransClient = require('midtrans-client');

@Injectable()
export class PaymentService {
    private readonly MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY;
    private readonly MIDTRANS_CLIENT_KEY = process.env.MIDTRANS_CLIENT_KEY;
    private readonly MIDTRANS_API_URL = 'https://api.sandbox.midtrans.com/v2';
    
    private readonly snap: any;

    constructor() {
        this.snap = new midtransClient.Snap({
            isProduction: false,
            serverKey: this.MIDTRANS_SERVER_KEY,
            clientKey: this.MIDTRANS_CLIENT_KEY,
        });
    }

    async createPayment(createPaymentDto: CreatePaymentDto) {
        try {
            // Validate that gross_amount matches the sum of item_details
            const calculatedAmount = createPaymentDto.itemDetails.reduce((sum, item) => {
                return sum + (item.price * item.quantity);
            }, 0);

            if (calculatedAmount !== createPaymentDto.amount) {
                throw new Error(`Amount mismatch: calculated ${calculatedAmount}, provided ${createPaymentDto.amount}`);
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
            }

            const token = await this.snap.createTransaction(payment);

            if (!token || !token.token) {
                throw new Error(`Payment creation failed: Invalid response from Midtrans`);
            }

            return { token: token.token };

        } catch (error) {
            throw new Error(`Failed to create payment: ${error.message}`);
        }
    }
    
    async checkPaymentStatus(orderId: string) {
        try {
            const response = await fetch(`${this.MIDTRANS_API_URL}/${orderId}/status`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Basic ${Buffer.from(this.MIDTRANS_SERVER_KEY + ':').toString('base64')}`,
                },
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Payment status check failed: ${response.status} - ${errorText}`);
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
