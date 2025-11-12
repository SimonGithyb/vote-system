import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { VoteDto } from './dto/vote.dto';
import { GiveVoteDto } from './dto/give-vote.dto';
import { Vote } from './schemas/vote.schema';
import { CastVote } from './schemas/cast-vote';
import { count } from 'console';

@Injectable()
export class VoteService {

  constructor(
    @InjectModel(Vote.name) private voteModel: Model<Vote>,
    @InjectModel(CastVote.name) private castVoteModel: Model<CastVote>,
  ) {}

  async createNewVote(data: VoteDto) {
    const { name, type, userId, expiryDate, publicResults, } = data;
    let { questions } = data;
    questions = JSON.parse(questions);

    await this.voteModel.create({
      name,
      type,
      questions,
      userId,
      expiryDate,
      publicResults,
    });

    return {
      message: 'Your vote is created!',
      status: 200,
    };
  }

  async getVoteById(voteId: string) {
    return await this.voteModel.findById(voteId);
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

  async getVoteCastByVoteid(voteId: string) {
    return await this.castVoteModel.find({ voteId });

  }
  
  async getVoteResult(voteId: string, userId: string) {

    const vote = await this.getVoteById(voteId);
    if ( !this.checkAccessToVoteResults( vote, userId ) )
      return {
        message: 'You havent access to results for this vote',
        status: 200,
      }
    const usersCasts = await this.getVoteCastByVoteid(voteId);
    const answers = this.preperAnswerForCount(vote.questions);

    const counted = this.countAnswers(usersCasts, answers);

    return {
      data: {
        voteName: vote.name,
        voteId: vote._id,
        results: counted
      },
      status: 200,
      message: `all results for vote ${vote.name}`
    }
  }

  checkAccessToVoteResults(vote: any, userId: string): boolean {
    if ( vote.publicResults )
      return true;
    else if ( vote.userId == userId )
      return true;
    return false;
  }

  preperAnswerForCount(questions) {
    const data = []
    questions.forEach(question => {
      question?.answers.forEach(answer => {
        data.push({
          questionName: question.name,
          answerName: answer,
          quantity: 0,
        })
      })
    });
    return data;
  }

  countAnswers(allUsersAnswers, allQuestions) {
    allUsersAnswers.forEach(userCast => {
      userCast.answers.forEach(answer => {
        allQuestions.forEach(el => {
        if ( answer === el.answerName) {
          el.quantity++;
        }
      })
      })
    });
    return allQuestions;
  }

}
