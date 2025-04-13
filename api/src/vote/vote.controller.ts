import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { VoteService } from './vote.service';
import { CreateVoteDto } from './dto/create-vote.dto';
import { PublicGiveVoteDto } from './dto/public-give-vote.dto';
import { AutenticationGuard } from '../guards/authentication.guard';

@Controller('vote')
export class VoteController {
  constructor(private readonly voteService: VoteService) {}

  @UseGuards(AutenticationGuard)
  @Post('createNewVote')
  createNewVote(@Body() createVoteDto: CreateVoteDto) {
    return this.voteService.createNewVote(createVoteDto);
  }

  @Get('getVote/:userId')
  getVoteByUserId(@Req() req) {
    return this.voteService.getVoteByUserId(req.userId);
  }

  @UseGuards(AutenticationGuard)
  @Post('givePublicVote')
  giveVote(@Body()  vote: PublicGiveVoteDto) {
    return this.voteService.saveVote(vote);
  }
}
