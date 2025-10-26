import { IsString, } from 'class-validator';

export class GiveVoteDto {
    @IsString()
    voteId: string;

    @IsString()
    votedUserId: string;

    @IsString()
    answer: string;
}
