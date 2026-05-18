import { BadRequestException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { VoteDto } from './dto/vote.dto';
import { GiveVoteDto } from './dto/give-vote.dto';
import { Vote } from './schemas/vote.schema';
import { CastVote } from './schemas/cast-vote';
import { count } from 'console';

import { VoteGateway } from './vote.gateway';

@Injectable()
export class VoteService {

  constructor(
    @InjectModel(Vote.name) private voteModel: Model<Vote>,
    @InjectModel(CastVote.name) private castVoteModel: Model<CastVote>,
    private readonly voteGateway: VoteGateway,
  ) {}

  async createNewVote(data: VoteDto, userId: string) {
    const { voteName, voteType, voteExpiry, publicResults, questions } = data;
    
    const expiryDate = new Date(voteExpiry).getTime();

    const newVote = await this.voteModel.create({
      name: voteName,
      type: voteType,
      questions,
      userId,
      expiryDate,
      publicResults: publicResults ?? true,
    });

    this.voteGateway.server.emit('voteCreated', newVote);

    return {
      message: 'Your vote is created!',
    };
  }

  async getVoteById(voteId: string) {
    const vote = await this.voteModel.findById(voteId);
    if (!vote) {
      throw new NotFoundException('Vote not found');
    }
    return vote;
  }

  async getVoteByUserId(data: any) {
    const { userId, size } = data; 

    return await this.voteModel.find({ userId }).limit(size);
  }

  async getVoteSizeByUserId(userId: string) {
    return await this.voteModel.countDocuments({ userId });
  }

  async getVoteByActive(active: string) {
    const toDay = Date.now();
    if ( active === 'all' ) {
      return await this.voteModel.find();
    } else if ( active === 'true') {
      return await this.voteModel.find({ expiryDate: { $gt: toDay } });
    } else if ( active === 'false' ) {
      return await this.voteModel.find({ expiryDate: { $lt: toDay } });
    }
    return [];
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
    return [];
  }

  async getAllVotes() {
    return await this.voteModel.find();
  }

  async getVotesByCategory(category: string) {
    return await this.voteModel.find({ category });
  }

  async deleteVote(id: string, userId: string) {
    const vote = await this.voteModel.findById(id);
    if (!vote) {
      throw new NotFoundException('Vote not found');
    }
    if (vote.userId.toString() !== userId) {
      throw new UnauthorizedException('Unauthorized');
    }
    return await this.voteModel.findByIdAndDelete(id);
  }

  async updateVote(id: string, data: VoteDto, userId: string) {
    const existingVote = await this.voteModel.findById(id);
    if (!existingVote) {
      throw new NotFoundException('Vote not found');
    }
    if (existingVote.userId.toString() !== userId) {
      throw new UnauthorizedException('Unauthorized');
    }

    const { voteName, voteType, voteExpiry, questions, publicResults } = data;
    const expiryDate = new Date(voteExpiry).getTime();

    return await this.voteModel.updateOne({_id: id}, {
      name: voteName,
      type: voteType,
      questions,
      userId,
      expiryDate,
      publicResults: publicResults ?? existingVote.publicResults
    });
  }

  async saveVoteCast(data: GiveVoteDto, userId: string) {
    const { voteId, answers } = data;
    
    // Check if user already voted
    const existingCast = await this.castVoteModel.findOne({ userId, voteId });
    if (existingCast) {
      throw new BadRequestException('You have already voted');
    }

    const cast = await this.castVoteModel.create({
      userId,
      voteId,
      answers,
      date: new Date().getTime(),
    });

    this.voteGateway.emitVoteUpdate(voteId);

    return cast;
  }

  async getVoteCastByVoteid(voteId: string) {
    return await this.castVoteModel.find({ voteId });
  }
  
  async getVoteResult(voteId: string, userId: string) {
    const vote = await this.voteModel.findById(voteId);
    if (!vote) {
      throw new NotFoundException('Vote not found');
    }

    if ( !this.checkAccessToVoteResults( vote, userId ) ) {
      throw new ForbiddenException('You have no access to results for this vote');
    }

    const usersCasts = await this.getVoteCastByVoteid(voteId);
    const answers = this.prepareAnswerForCount(vote.questions);

    const counted = this.countAnswers(usersCasts, answers, vote.questions);

    return {
      voteName: vote.name,
      voteId: vote._id,
      results: counted
    };
  }

  checkAccessToVoteResults(vote: any, userId: string): boolean {
    if ( vote.publicResults )
      return true;
    if ( userId && userId !== 'null' && userId !== 'undefined' && vote.userId.toString() === userId )
      return true;
    return false;
  }

  prepareAnswerForCount(questions) {
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

  countAnswers(allUsersAnswers, allQuestions, originalQuestions) {
    allUsersAnswers.forEach(userCast => {
      userCast.answers.forEach((answer, index) => {
        const questionName = originalQuestions[index]?.name;
        const questionMatch = allQuestions.find(el => 
          el.answerName === answer && el.questionName === questionName
        );
        if (questionMatch) {
          questionMatch.quantity++;
        }
      })
    });
    return allQuestions;
  }

}
