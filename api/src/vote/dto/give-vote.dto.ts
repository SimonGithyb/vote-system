import { IsArray, IsString } from 'class-validator';

export class GiveVoteDto {
    @IsString()
    voteId: string;

    @IsArray()
    answers: string[];
}
