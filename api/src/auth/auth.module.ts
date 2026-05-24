import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User, UserSchema } from './schemas/user.schema';
import { RefreshToken, RefreshTokenSchema } from './schemas/refresh-token.schema';
import { ResetToken, ResetTokenSchema } from './schemas/reset-token.schema';
import { MailService } from 'src/services/mail.service';
import { LoggingMiddleware } from 'src/middlewares/logging.middleware';
import { GoogleStrategy } from './google.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema
      },
      {
        name: RefreshToken.name,
        schema: RefreshTokenSchema
      },
      {
        name: ResetToken.name,
        schema: ResetTokenSchema
      },
    ]),
    PassportModule,
    ConfigModule,
  ],
  controllers: [
    AuthController,
  ],
  providers: [
    AuthService,
    MailService,
    GoogleStrategy,
  ],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
