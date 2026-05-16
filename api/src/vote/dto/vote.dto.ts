import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class VoteDto {
    @IsString()
    name: string;

    @IsString()
    type: string;

    @IsString()
    questions: string;

    @IsString()
    expiryDate: string;

    @IsOptional()
    @IsBoolean()
    publicResults?: boolean;
}