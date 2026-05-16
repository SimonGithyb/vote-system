import { IsObject, IsString, } from 'class-validator';

export class GiveVoteDto {
    @IsString()
    voteId: string;

    @IsObject()
    answers: object;
}
