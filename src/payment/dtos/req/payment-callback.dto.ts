import { IsString, IsArray, IsOptional, ValidateNested, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class VaNumberDto {
    @IsString()
    @IsNotEmpty()
    va_number: string;

    @IsString()
    @IsNotEmpty()
    bank: string;
}

export class PaymentAmountDto {
    @IsString()
    @IsOptional()
    paid_at: string;

    @IsString()
    @IsOptional()
    paid_amount: string;

    @IsString()
    @IsOptional()
    paid_amount_str: string;
}

export class PaymentCallbackRequestDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => VaNumberDto)
    @IsOptional()
    va_numbers: VaNumberDto[];

    @IsString()
    @IsNotEmpty()
    transaction_time: string;

    @IsString()
    @IsNotEmpty()
    transaction_status: string;

    @IsString()
    @IsNotEmpty()
    transaction_id: string;

    @IsString()
    @IsNotEmpty()
    status_message: string;

    @IsString()
    @IsNotEmpty()
    status_code: string;

    @IsString()
    @IsNotEmpty()
    signature_key: string;

    @IsString()
    @IsOptional()
    settlement_time: string;

    @IsString()
    @IsNotEmpty()
    payment_type: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => PaymentAmountDto)
    @IsOptional()
    payment_amounts: PaymentAmountDto[];

    @IsString()
    @IsNotEmpty()
    order_id: string;

    @IsString()
    @IsNotEmpty()
    merchant_id: string;

    @IsString()
    @IsNotEmpty()
    gross_amount: string;

    @IsString()
    @IsNotEmpty()
    fraud_status: string;

    @IsString()
    @IsOptional()
    expiry_time: string;

    @IsString()
    @IsNotEmpty()
    currency: string;

    @IsString()
    @IsOptional()
    custom_field1: string;
}