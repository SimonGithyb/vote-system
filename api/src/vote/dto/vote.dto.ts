import { IsBoolean, IsOptional, IsString, IsArray, IsNotEmpty } from 'class-validator';

export class VoteDto {
    @IsString()
    @IsNotEmpty()
    voteName: string;

    @IsString()
    @IsNotEmpty()
    voteType: string;

    @IsArray()
    @IsNotEmpty()
    questions: any[];

    @IsString()
    @IsNotEmpty()
    voteExpiry: string;

    @IsOptional()
    @IsBoolean()
    publicResults?: boolean;
}
