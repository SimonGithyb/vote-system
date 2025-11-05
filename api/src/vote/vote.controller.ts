import { Controller, Get, Post, Body, Req, UseGuards, Delete, Put } from '@nestjs/common';

import { VoteService } from './vote.service';
import { VoteDto } from './dto/vote.dto';
import { GiveVoteDto } from './dto/give-vote.dto';
import { AutenticationGuard } from '../guards/authentication.guard';

@Controller('vote')
export class VoteController {
  constructor(private readonly voteService: VoteService) {}

  @UseGuards(AutenticationGuard)
  @Post()
  async createNewVote(@Body() data: VoteDto) {
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
    return this.voteService.getVoteSizeByUserId(req.params.userId);
  }

  @UseGuards(AutenticationGuard)
  @Get('getVotes/:active')
  async getVoteByActive(@Req() req) {
    return this.voteService.getVoteByActive(req.params.active);
  }

  @Get('getVotesNoSession/:active')
  async getVoteByActiveNoSession(@Req() req) {
    return this.voteService.getVoteByActiveNoSession(req.params.active);
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

  @UseGuards(AutenticationGuard)
  @Delete(':id')
  async deleteVote(@Req() req) {
    return this.voteService.deleteVote(req.params.id);
  }

  @UseGuards(AutenticationGuard)
  @Put(':id')
  async updateVote(@Req() req, @Body() data: VoteDto) {
    return this.voteService.updateVote(req.params.id, data);
  }

  @Post('saveVoteCast')
 async saveUserVote(@Body() data: any) {
    return this.voteService.saveVoteCast(data);
  }
}
