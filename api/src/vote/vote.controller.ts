import { Controller, Get, Post, Body, Req, UseGuards, Delete, Put, Param } from '@nestjs/common';

import { VoteService } from './vote.service';
import { VoteDto } from './dto/vote.dto';
import { GiveVoteDto } from './dto/give-vote.dto';
import { AuthenticationGuard } from '../guards/authentication.guard';

@Controller('vote')
export class VoteController {
  constructor(private readonly voteService: VoteService) {}

  @UseGuards(AuthenticationGuard)
  @Post()
  async createNewVote(@Body() data: VoteDto, @Req() req) {
    return this.voteService.createNewVote(data, req.userId);
  }

  @UseGuards(AuthenticationGuard)
  @Get('getVote/:userId/:lastRecordId/:size')
  async getVoteByUserId(
    @Param('userId') userId: string,
    @Param('size') size: number,
  ) {
    return this.voteService.getVoteByUserId({ userId, size });
  }

  @UseGuards(AuthenticationGuard)
  @Get('getVoteSize/:userId')
  async getVoteSizeByUserId(@Param('userId') userId: string) {
    return this.voteService.getVoteSizeByUserId(userId);
  }

  @UseGuards(AuthenticationGuard)
  @Get('getVotes/:active')
  async getVoteByActive(@Param('active') active: string) {
    return this.voteService.getVoteByActive(active);
  }

  @Get('getVotesNoSession/:active')
  async getVoteByActiveNoSession(@Param('active') active: string) {
    return this.voteService.getVoteByActiveNoSession(active);
  }

  @UseGuards(AuthenticationGuard)
  @Get('getAllVote')
  async getAllVotes() {
    return this.voteService.getAllVotes();
  }

  @Get('getVoteCategory/:category')
  async getVotesByCategory(@Param('category') category: string) {
    return this.voteService.getVotesByCategory(category);
  }

  @UseGuards(AuthenticationGuard)
  @Delete(':id')
  async deleteVote(@Param('id') id: string, @Req() req) {
    return this.voteService.deleteVote(id, req.userId);
  }

  @UseGuards(AuthenticationGuard)
  @Put(':id')
  async updateVote(@Param('id') id: string, @Body() data: VoteDto, @Req() req) {
    return this.voteService.updateVote(id, data, req.userId);
  }

  @UseGuards(AuthenticationGuard)
  @Post('saveVoteCast')
  async saveUserVote(@Body() data: GiveVoteDto, @Req() req) {
    return this.voteService.saveVoteCast(data, req.userId);
  }

  @Get('voteResults/:voteId/:userId')
  async voteResuls(
    @Param('voteId') voteId: string,
    @Param('userId') userId: string,
  ) {
    return this.voteService.getVoteResult(voteId, userId);
  }
}
