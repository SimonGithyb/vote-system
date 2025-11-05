import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { VoteDto } from './dto/vote.dto';
import { GiveVoteDto } from './dto/give-vote.dto';
import { Vote } from './schemas/vote.schema';
import { GiveVote } from './schemas/give-vote';

@Injectable()
export class VoteService {

  constructor(
    @InjectModel(Vote.name) private voteModel: Model<Vote>,
    @InjectModel(GiveVote.name) private castVoteModel: Model<GiveVote>,
  ) {}

  async createNewVote(data: VoteDto) {
    const { name, type, userId, expiryDate } = data;
    let { questions } = data;
    questions = JSON.parse(questions);

    await this.voteModel.create({
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
    const { userId, size } = data; 

    return await this.voteModel.find({ userId}).limit(size);
  }

  async getVoteSizeByUserId(userId: string) {
    const data = await this.voteModel.find({ userId });

    return data.length;
  }

  async getVoteByActive(active: string) {
    const toDay = Date.now();
    if ( active === 'all' ) {
      return await this.voteModel.find();
    } else if ( active === 'true') {
      return await this.voteModel.find({ expiryDate: { $gt: toDay } });
    } else if ( active === 'false' ) {
      return await this.voteModel.find({ expiryDate: { $lt: toDay } });
    } else {}
  }

  async getVoteByActiveNoSession(active: string) {
       const toDay = Date.now();
    if ( active === 'all' ) {
      return await this.voteModel.find({ type: 'public' });
    } else if ( active === 'true' ) {
      return await this.voteModel.find({ expiryDate: { $gt: toDay }, type: 'public' });
    }  else if ( active === 'false' ) {
      return await this.voteModel.find({ expiryDate: { $lt: toDay }, type: 'public' });
    }
  }

  async getAllVotes() {
    return await this.voteModel.find();
  }

  async getVotesByCategory(category: string) {
    return await this.voteModel.find({ category });
  }

  async deleteVote(id: any) {
    return await this.voteModel.findByIdAndDelete(id);
  }

  async updateVote(id: any, vote: VoteDto) {
    const { name, type, userId, expiryDate } = vote;
    let { questions } = vote;
    questions = JSON.parse(questions);

    return await this.voteModel.updateOne({_id: id}, {
      name,
      type,
      questions,
      userId,
      expiryDate,
    });
  }

  async saveVoteCast(data: GiveVoteDto) {
    const { userId, voteId, answers } = data;
    return await this.castVoteModel.create({
      userId,
      voteId,
      answers,
      date: new Date().getTime(),
    });
  }
}
