import { IsArray, IsBoolean, IsDate, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export class UpdateEventImageDto {
    @IsOptional()
    @IsNumber()
    id?: number; // For updating existing images

    @IsOptional()
    @IsString()
    imageUrl?: string;

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

export class UpdateEventDto {
    @IsOptional()
    @IsString()
    name?: string;
    
    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    date?: Date;

    @IsOptional()
    @IsString()
    location?: string;

    @IsOptional()
    @IsString()
    thumbnailUrl?: string;

    @IsOptional()
    @IsString()
    bannerUrl?: string;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => UpdateEventImageDto)
    images?: UpdateEventImageDto[];
}
