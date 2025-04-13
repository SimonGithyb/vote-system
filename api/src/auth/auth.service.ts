import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { nanoid } from 'nanoid';
import { JwtService } from '@nestjs/jwt';

import { User } from './schemas/user.schema';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshToken } from './schemas/refresh-token.schema';
import { ResetToken } from './schemas/reset-token.schema';
import { MailService } from 'src/services/mail.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private UserModel: Model<User>,
    @InjectModel(RefreshToken.name) private RefreshTokenModel: Model<RefreshToken>,
    @InjectModel(RefreshToken.name) private ResetTokenModel: Model<ResetToken>,
    private jwtService: JwtService,  
    private mailService: MailService,
  ) {}

  async signup(signupData: SignupDto) {
    const { name, email, password } = signupData;

    const emailInUse = await this.UserModel.findOne({
      email
    });

    if(emailInUse) {
      throw new BadRequestException("Email already in use!");
    }

    const hashPassword = await bcrypt.hash(password, 10);

    await this.UserModel.create({
      name,
      email,
      password: hashPassword,
    });

    return 'Account is added!';
  }

  async login(credentials : LoginDto) {
    const { email, password } = credentials;

    const user = await this.UserModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException("Wrong credentials");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException("Wrong credentials");
    }

    const tokens = this.generateUserTokens(user._id);
    
    return {
      ...tokens,
      userId: user._id,
      message: 'Login with success',
    };
  }

  async logout(token: string) {
    try {
      
    } catch(err) {
      Logger.error(err);
    }

    return {
      "message": "logout with success",
      "success": true,
    }
  }

  async refreshToken(refreshToken: string) {
    const token = await this.RefreshTokenModel.findOne({
      token: refreshToken,
      expiryDate: { $gte: new Date() },
    })

    if (!token) {
      throw new UnauthorizedException('Refresh token is invalid');
    }

    return this.generateUserTokens(token.userId)

  }

  async changePassword(userId, oldPassword, newPassword) {
    const user = await this.UserModel.findById({ userId });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const passwordMatch = await bcrypt.compare(oldPassword, user.password);

    if (!passwordMatch) {
      throw new UnauthorizedException("Wrong credentials");
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return {
      "message": 'Password is changes with success!',
    }
  }

  async forgotPassword(email) {
    const user = await this.UserModel.findOne({ email });

    if (user) {
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const resetToken = nanoid(64);
      this.ResetTokenModel.create({
        token: resetToken,
        userId: user._id,
        expiryDate
      });

      this.mailService.sendPasswordResetEmail(email, resetToken);
    }

    return {
      "message": "If this user exists, they will receive an email"
    }
  }

  async resetPassword(newPassword, resetToken) {
    const token = await this.ResetTokenModel.findOneAndDelete({
      token: resetToken,
      expiryDate: { $gte: new Date() },
    });

    if (!token) {
      throw new UnauthorizedException('Invalid link');
    }

    const user = await this.UserModel.findById(token.userId);

    if (!user) {
      throw new InternalServerErrorException('User not found');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return {
      "message": "Change password with success",
    }
  }

  async generateUserTokens(userId) {
    const accessToken = this.jwtService.sign({ userId });
    const RefreshToken = uuidv4();
    
    await this.storeRefreshToken(RefreshToken, userId)

    return {
      accessToken,
      RefreshToken
    };
  }

  async storeRefreshToken(token: string, userId) {
    //Calculate expiry date 1 days from now
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 3);

    await this.RefreshTokenModel.updateOne(
      { userId },
      {$set: { expiryDate, token }},
      {
        upsert: true,
      }
    );

  }
}
