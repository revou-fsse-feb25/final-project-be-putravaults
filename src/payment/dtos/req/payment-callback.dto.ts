export class PaymentCallbackRequestDto {
    order_id: string;
    transaction_status: string;
    payment_type: string;
    fraud_status: string;
    statusCode: string;
    gross_amount: string;
    signature_key: string;
}