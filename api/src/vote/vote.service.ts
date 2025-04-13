import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateVoteDto } from './dto/create-vote.dto';
import { PublicGiveVoteDto } from './dto/public-give-vote.dto';
import { CreateVote } from './schemas/create-vote.schema';
import { PublicGiveVote } from './schemas/give-vote';

@Injectable()
export class VoteService {

  constructor(
    @InjectModel(CreateVote.name) private createVoteModel: Model<CreateVote>,
    @InjectModel(PublicGiveVote.name) private publicGiveVoteModel: Model<PublicGiveVote>,
  ) {}

  async createNewVote(createVoteDto: CreateVoteDto) {
    const { name, type, forFuture, answers, ownerId, category, } = createVoteDto;

    await this.createVoteModel.create({
      name,
      type,
      forFuture,
      answers,
      ownerId,
      category,
    });

    return {
      message: 'Your vote is created!',
      status: 200,
    };
  }

  async getVoteByUserId(userId: string) {
    return await this.createVoteModel.find({ userId });
  }

  async getAllVotes() {
    return await this.createVoteModel.find();
  }

  async getVotesByCategory(category) {
    return await this.createVoteModel.find({ category });
  }

  async saveVote(vote: PublicGiveVoteDto) {
    await this.publicGiveVoteModel.create(
      vote
    );

    return {
      message: 'Your vote is saved with succes. Thanks you for vote!',
      status: 200,
    }
  }
}
