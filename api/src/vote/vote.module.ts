import { Module } from '@nestjs/common';
import { VoteService } from './vote.service';
import { VoteController } from './vote.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Vote, VoteSchema } from './schemas/vote.schema';
import { CastVote, CastVoteSchema } from './schemas/cast-vote';
import { VoteGateway } from './vote.gateway';

@Module({
  imports: [MongooseModule.forFeature([
      {
        name: Vote.name,
        schema: VoteSchema
      },
      {
        name: CastVote.name,
        schema: CastVoteSchema
      },
    ])],
  controllers: [VoteController],
  providers: [VoteService, VoteGateway],
  exports: [VoteGateway],
})
export class VoteModule {}
