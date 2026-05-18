import { Controller, Get, Post, Body, Put, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

import { AuthenticationGuard } from '../guards/authentication.guard';
import { AuthorizationGuard } from '../guards/authorization.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'User signup' })
  async signup(@Body() signupData: SignupDto) {
    return this.authService.signup(signupData);
  }

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  async login(@Body() credentials: LoginDto) {
    return this.authService.login(credentials);
  }

  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard)
  @Get('logout')
  @ApiOperation({ summary: 'User logout' })
  async logout(@Req() req) {
    return this.authService.logout(req.userId);
  }

  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard)
  @Post('refresh')
  @ApiOperation({ summary: 'Refresh authentication token' })
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto.token);
  }

  @ApiBearerAuth()
  @UseGuards(AuthenticationGuard ,AuthorizationGuard)
  @Put('change-password')
  @ApiOperation({ summary: 'Change user password' })
  async changePassowrd(
    @Body() changePasswordDto: ChangePasswordDto,
    @Req() req
  ) {
    return this.authService.changePassword(
      req.userId,
      changePasswordDto.oldPassword,
      changePasswordDto.newPassword,
    );
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Initiate forgot password process' })
  async forgotPassword(@Body() forgotPasswordDto : ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto.email);
  }

  @Put('reset-password')
  @ApiOperation({ summary: 'Reset user password' })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(
      resetPasswordDto.newPassword,
      resetPasswordDto.resetToken,
    );
  }
}
