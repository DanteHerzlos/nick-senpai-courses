import { Module } from "@nestjs/common"
import { MongooseModule } from '@nestjs/mongoose'
import { ServeStaticModule } from "@nestjs/serve-static"
import { CourseModule } from "./course/course.module"
import { FileModule } from "./file/file.module"
import { LessonModule } from "./lesson/lesson.module"
import { UserModule } from "./user/user.module"
import { AuthModule } from './auth/auth.module'
import { ConfigModule } from "@nestjs/config"
import { TokenModule } from "./token/token.module"
import { APP_GUARD } from "@nestjs/core"
import { RolesGuard } from "./auth/guards/roles.guard"
import * as path from "path"
import { MailerModule } from "@nestjs-modules/mailer"
import { ProgressModule } from "./progress/progress.module"



@Module({
    imports: [
        MailerModule.forRoot({
            transport: {
                host: process.env.SMTP_HOST,
                port: parseInt(process.env.SMTP_PORT),
                secure: true,
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASSWORD
                }
            },
        }),
        ConfigModule.forRoot(),
        MongooseModule.forRoot(process.env.DB_SETTINGS),
        ServeStaticModule.forRoot({
            rootPath: path.resolve(__dirname, '..', 'client', 'dist'),
            // renderPath: path.resolve(__dirname, 'static'),

        }),
        UserModule,
        LessonModule,
        CourseModule,
        FileModule,
        AuthModule,
        TokenModule,
        ProgressModule
    ],
    providers: [{  
        provide: APP_GUARD,
        useClass: RolesGuard,
    } ]
})
export class AppModule {}