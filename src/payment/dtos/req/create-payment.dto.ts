import { IsString, IsNumber, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class ItemDetailDto {
    @IsString()
    id: string;

    @IsNumber()
    price: number;

    @IsNumber()
    quantity: number;

    @IsString()
    name: string;
}

export class CreatePaymentDto {
    @IsString()
    orderId: string;

    @IsNumber()
    amount: number;

    @IsString()
    customerName: string;

    @IsString()
    customerEmail: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ItemDetailDto)
    itemDetails: ItemDetailDto[];
}
