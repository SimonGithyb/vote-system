import { IsArray, IsBoolean, IsEmail, IsString, Matches, MinLength } from 'class-validator';

export class CreateVoteDto {
    @IsString()
    name: string;

    @IsString()
    type: string;

    @IsBoolean()
    forFuture: boolean;

    @IsArray()
    answers: [];

    @IsString()
    ownerId: string;
    
    @IsString()
    category: string;
}