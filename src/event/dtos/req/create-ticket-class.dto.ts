import { IsNotEmpty, IsNumber, IsString, IsPositive, IsOptional } from 'class-validator';

export class CreateTicketClassDto {
    @IsNotEmpty()
    @IsNumber()
    eventId: number;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsNotEmpty()
    @IsPositive()
    price: number;
}
