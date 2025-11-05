import { Module } from '@nestjs/common';
import { VoteService } from './vote.service';
import { VoteController } from './vote.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Vote, VoteSchema } from './schemas/vote.schema';
import { GiveVote, GiveVoteSchema } from './schemas/give-vote';

@Module({
  imports: [MongooseModule.forFeature([
      {
        name: Vote.name,
        schema: VoteSchema
      },
      {
        name: GiveVote.name,
        schema: GiveVoteSchema
      },
    ])],
  controllers: [VoteController],
  providers: [VoteService],
})
export class VoteModule {}
