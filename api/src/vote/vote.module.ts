import { Module } from '@nestjs/common';
import { VoteService } from './vote.service';
import { VoteController } from './vote.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CreateVote, CreateVoteSchema } from './schemas/create-vote.schema';
import { PublicGiveVote, PublicGiveVoteSchema } from './schemas/give-vote';

@Module({
  imports: [MongooseModule.forFeature([
      {
        name: CreateVote.name,
        schema: CreateVoteSchema
      },
      {
        name: PublicGiveVote.name,
        schema: PublicGiveVoteSchema
      },
    ])],
  controllers: [VoteController],
  providers: [VoteService],
})
export class VoteModule {}
