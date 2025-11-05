import { IsObject, IsString, } from 'class-validator';

export class GiveVoteDto {
    @IsString()
    voteId: string;

    @IsString()
    userId: string;

    @IsObject()
    answers: object;
}
