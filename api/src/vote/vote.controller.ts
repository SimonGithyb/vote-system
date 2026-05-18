import { Controller, Get, Post, Body, Req, UseGuards, Delete, Put, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

import { VoteService } from './vote.service';
import { VoteDto } from './dto/vote.dto';
import { GiveVoteDto } from './dto/give-vote.dto';
import { AuthenticationGuard } from '../guards/authentication.guard';

@ApiTags('vote')
@Controller('vote')
export class VoteController {
  constructor(private readonly voteService: VoteService) {}

  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new vote' })
  async createNewVote(@Body() data: VoteDto, @Req() req) {
    return this.voteService.createNewVote(data, req.userId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard)
  @Get('getVote/:userId/:lastRecordId/:size')
  @ApiOperation({ summary: 'Get votes by user ID' })
  async getVoteByUserId(
    @Param('userId') userId: string,
    @Param('lastRecordId') lastRecordId: string,
    @Param('size') size: number,
  ) {
    return this.voteService.getVoteByUserId({ userId, lastRecordId, size });
  }

  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard)
  @Get('getVoteSize/:userId')
  @ApiOperation({ summary: 'Get total number of votes by user ID' })
  async getVoteSizeByUserId(@Param('userId') userId: string) {
    return this.voteService.getVoteSizeByUserId(userId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard)
  @Get('getVotes/:active')
  @ApiOperation({ summary: 'Get votes by active status' })
  async getVoteByActive(@Param('active') active: string) {
    return this.voteService.getVoteByActive(active);
  }

  @Get('getVotesNoSession/:active')
  @ApiOperation({ summary: 'Get votes by active status without session' })
  async getVoteByActiveNoSession(@Param('active') active: string) {
    return this.voteService.getVoteByActiveNoSession(active);
  }

  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard)
  @Get('getAllVote')
  @ApiOperation({ summary: 'Get all votes' })
  async getAllVotes() {
    return this.voteService.getAllVotes();
  }

  @Get('getVoteCategory/:category')
  @ApiOperation({ summary: 'Get votes by category' })
  async getVotesByCategory(@Param('category') category: string) {
    return this.voteService.getVotesByCategory(category);
  }

  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a vote' })
  async deleteVote(@Param('id') id: string, @Req() req) {
    return this.voteService.deleteVote(id, req.userId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard)
  @Put(':id')
  @ApiOperation({ summary: 'Update a vote' })
  async updateVote(@Param('id') id: string, @Body() data: VoteDto, @Req() req) {
    return this.voteService.updateVote(id, data, req.userId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard)
  @Post('saveVoteCast')
  @ApiOperation({ summary: 'Cast a vote' })
  async saveUserVote(@Body() data: GiveVoteDto, @Req() req) {
    return this.voteService.saveVoteCast(data, req.userId);
  }

  @Get('voteResults/:voteId/:userId')
  @ApiOperation({ summary: 'Get vote results' })
  async voteResuls(
    @Param('voteId') voteId: string,
    @Param('userId') userId: string,
  ) {
    return this.voteService.getVoteResult(voteId, userId);
  }
}
