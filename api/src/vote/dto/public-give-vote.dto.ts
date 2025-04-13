import { IsString, } from 'class-validator';

export class PublicGiveVoteDto {
    @IsString()
    voteId: string;

    @IsString()
    votedUserId: string;

    @IsString()
    answer: string;
}
