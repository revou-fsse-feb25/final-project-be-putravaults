import { IsNotEmpty, IsNumber, IsArray, ArrayMinSize, ValidateNested } from 'class-validator';
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

    @IsNotEmpty()
    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => TicketBookingItem)
    tickets: TicketBookingItem[];
}
