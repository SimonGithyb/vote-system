import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { VoteService } from './vote.service';
import { CreateVoteDto } from './dto/create-vote.dto';
import { GiveVoteDto } from './dto/give-vote.dto';
import { AutenticationGuard } from '../guards/authentication.guard';

@Controller('vote')
export class VoteController {
  constructor(private readonly voteService: VoteService) {}

  @UseGuards(AutenticationGuard)
  @Post('createNewVote')
  async createNewVote(@Body() data: CreateVoteDto) {
    return this.voteService.createNewVote(data);
  }

  @UseGuards(AutenticationGuard)
  @Get('getVote/:userId/:lastRecordId/:size')
  async getVoteByUserId(@Req() req) {
    return this.voteService.getVoteByUserId(req);
  }

  @UseGuards(AutenticationGuard)
  @Get('getVoteSize/:userId')
  async getVoteSizeByUserId(@Req() req) {
    return this.voteService.getVoteSizeByUserId(req.userId);
  }

  @Get('getVote/:active/:session')
  async getVoteByActiveAndSession(@Req() req) {
    return this.voteService.getVoteByActiveAndSession(req.active, req.session);
  }

  @UseGuards(AutenticationGuard)
  @Get('getAllVote')
  async getAllVotes() {
    return this.voteService.getAllVotes();
  }

  @Get('getVoteCategory/:category')
  async getVotesByCategory(@Req() req) {
    return this.voteService.getVoteByUserId(req.userId);
  }

  @Post('givePublicVote')
  async giveVote(@Body()  vote: GiveVoteDto) {
    return this.voteService.saveVote(vote);
  }
}
