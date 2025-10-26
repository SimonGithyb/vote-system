import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateVoteDto } from './dto/create-vote.dto';
import { GiveVoteDto } from './dto/give-vote.dto';
import { Vote } from './schemas/create-vote.schema';
import { GiveVote } from './schemas/give-vote';

@Injectable()
export class VoteService {

  constructor(
    @InjectModel(Vote.name) private createVoteModel: Model<Vote>,
    @InjectModel(GiveVote.name) private publicGiveVoteModel: Model<GiveVote>,
  ) {}

  async createNewVote(createVoteDto: CreateVoteDto) {
    const { name, type, userId, expiryDate } = createVoteDto;
    let { questions } = createVoteDto;
    questions = JSON.parse(questions);

    await this.createVoteModel.create({
      name,
      type,
      questions,
      userId,
      expiryDate,
    });

    return {
      message: 'Your vote is created!',
      status: 200,
    };
  }

  async getVoteByUserId(data: any) {
    const { userId, lastRecordId, size } = data; 

    return await this.createVoteModel.find({ userId}).limit(size);
  }

  async getVoteSizeByUserId(userId: string) {
    const data = await this.createVoteModel.find({ userId });

    return data.length;
  }

  async getVoteByActiveAndSession(active: string, session: boolean) {
    const toDay = Date.now();
    if ( active == 'all' && session ) {
      return await this.createVoteModel.find();
    } else if ( active == 'all' && !session ) {
      return await this.createVoteModel.find({ type: 'public' });
    } else if ( active && session ) {
      return await this.createVoteModel.find({ expiryDate: { $gt: toDay } });
    } else if ( !active && session ) {
      return await this.createVoteModel.find({ expiryDate: { $lt: toDay } });
    } else if ( active && !session ) {
      return await this.createVoteModel.find({ expiryDate: { $gt: toDay }, type: 'public' });
    } else if ( !active && !session ) {
      return await this.createVoteModel.find({ expiryDate: { $lt: toDay }, type: 'public' });
    } else {}
  }

  async getAllVotes() {
    return await this.createVoteModel.find();
  }

  async getVotesByCategory(category: string) {
    return await this.createVoteModel.find({ category });
  }

  async saveVote(vote: GiveVoteDto) {
    await this.publicGiveVoteModel.create(
      vote
    );

    return {
      message: 'Your vote is saved with succes. Thanks you for vote!',
      status: 200,
    }
  }
}
