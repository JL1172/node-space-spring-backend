import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import {
  RateLimiter,
  SanitizeBody,
  ValidateBody,
  VerifyUserIsUnique,
} from './middleware /registration';
import { AuthenticationController } from './auth-controller';
import { PrismaProvider } from 'src/global-utils/providers/prisma';
import { BcryptProvider } from './providers/bcrypt';
import {
  RateLimter,
  ValidateLoginBody,
  SanitizeLoginBody,
  ValidateUserExists,
  ValidateUserPasswordIsCorrect,
} from './middleware /login';
import { UserClass } from './providers/login';
import { AuthenticationErrorHandler } from './providers/error';
import { JwtProvider } from './providers/jwt';

@Module({
  imports: [],
  controllers: [AuthenticationController],
  providers: [
    PrismaProvider,
    BcryptProvider,
    UserClass,
    AuthenticationErrorHandler,
    JwtProvider,
  ],
})
export class AuthenticationModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RateLimiter, ValidateBody, SanitizeBody, VerifyUserIsUnique)
      .forRoutes('/api/auth/registration');
    consumer
      .apply(
        RateLimter,
        ValidateLoginBody,
        SanitizeLoginBody,
        ValidateUserExists,
        ValidateUserPasswordIsCorrect,
      )
      .forRoutes('/api/auth/login');
  }
}