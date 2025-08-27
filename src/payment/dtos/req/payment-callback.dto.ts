export class VaNumberDto {
    va_number: string;
    bank: string;
}

export class PaymentAmountDto {
    paid_at: string;
    paid_amount: string;
    paid_amount_str: string;
}

export class PaymentCallbackRequestDto {
    va_numbers: VaNumberDto[];
    transaction_time: string;
    transaction_status: string;
    transaction_id: string;
    status_message: string;
    status_code: string;
    signature_key: string;
    settlement_time: string;
    payment_type: string;
    payment_amounts: PaymentAmountDto[];
    order_id: string;
    merchant_id: string;
    gross_amount: string;
    fraud_status: string;
    expiry_time: string;
    currency: string;
}