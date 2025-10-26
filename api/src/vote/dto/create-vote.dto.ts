import { IsArray, IsBoolean, IsDate, IsEmail, IsString, Matches, MinLength } from 'class-validator';

export class CreateVoteDto {
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
}