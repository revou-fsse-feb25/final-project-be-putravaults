import { IsArray, IsBoolean, IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export class CreateEventImageDto {
    @IsNotEmpty()
    @IsString()
    imageUrl: string;

    @IsOptional()
    @IsString()
    altText?: string;

    @IsOptional()
    @IsNumber()
    displayOrder?: number;

    @IsOptional()
    @IsBoolean()
    isPrimary?: boolean;
}

export class CreateEventDto {
    @IsNotEmpty()
    @IsString()
    name: string;
    
    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    date: Date;

    @IsNotEmpty()
    @IsString()
    location: string;

    @IsOptional()
    @IsString()
    thumbnailUrl?: string;

    @IsOptional()
    @IsString()
    bannerUrl?: string;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateEventImageDto)
    images?: CreateEventImageDto[];
}