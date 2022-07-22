import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MailService } from 'src/mail/mail.service';
import { Token, TokenSchema } from 'src/token/token.schema';
import { TokenService } from 'src/token/token.service';
import { UserModule } from 'src/user/user.module';
import { User, UserSchema } from 'src/user/user.schema';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';


@Module({
  imports: [
    MongooseModule.forFeature([{name: User.name, schema: UserSchema}]),
    MongooseModule.forFeature([{name: Token.name, schema: TokenSchema}]),
    ConfigModule.forRoot(),
    UserModule,
  ],
  controllers:[AuthController],
  providers: [AuthService, TokenService, JwtStrategy, MailService],
  exports: [AuthService],
})
export class AuthModule {}
