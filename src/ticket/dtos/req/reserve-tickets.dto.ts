import { IsInt, IsPositive, IsOptional, IsArray, ArrayMinSize } from 'class-validator';

export class ReserveTicketsDto {
    @IsInt()
    @IsPositive()
    eventId: number;

    @IsInt()
    @IsPositive()
    ticketClassId: number;

    @IsInt()
    @IsPositive()
    quantity: number;

    @IsOptional()
    @IsArray()
    @ArrayMinSize(1)
    seatNumbers?: string[]; // Optional seat numbers for seated events
}
