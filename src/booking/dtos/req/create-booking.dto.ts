import { IsNotEmpty, IsNumber, IsArray, ArrayMinSize, ValidateNested, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class TicketBookingItem {
    @IsNotEmpty()
    @IsNumber()
    ticketClassId: number;

    @IsNotEmpty()
    @IsNumber()
    quantity: number;
}

export class CreateBookingDto {
    @IsNotEmpty()
    @IsNumber()
    userId: number;

    @IsOptional()
    @IsString()
    orderId?: string;

    @IsNotEmpty()
    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => TicketBookingItem)
    tickets: TicketBookingItem[];
}
