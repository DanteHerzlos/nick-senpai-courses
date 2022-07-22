import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { AuthService } from "src/auth/auth.service"
import { MailService } from "src/mail/mail.service"
import { Token, TokenSchema } from "src/token/token.schema"
import { TokenService } from "src/token/token.service"
import { UserController } from "./user.controller"
import { User, UserSchema } from "./user.schema"
import { UserService } from "./user.service"


@Module({
    imports: [
        MongooseModule.forFeature([{name: User.name, schema: UserSchema}]),
        MongooseModule.forFeature([{name: Token.name, schema: TokenSchema}]),
    ],
    controllers: [UserController],
    providers: [UserService, AuthService, TokenService, MailService],
})
export class UserModule {}
