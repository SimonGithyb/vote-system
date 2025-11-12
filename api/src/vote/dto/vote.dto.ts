import { IsBoolean, IsString } from 'class-validator';

export class VoteDto {
    @IsString()
    name: string;

    @IsString()
    type: string;

    @IsString()
    questions: string;

    @IsString()
    userId: string;

    @IsString()
    expiryDate: string;

    @IsString()
    publicResults: boolean;
}