import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { FileService } from "src/file/file.service"
import { MailService } from "src/mail/mail.service"
import { User, UserSchema } from "src/user/user.schema"
import { CourseController } from "./course.controller"
import { Course, CourseSchema } from "./course.schema"
import { CourseService } from "./course.service"


@Module({
    imports: [
        MongooseModule.forFeature([{name: Course.name, schema: CourseSchema}]),
        MongooseModule.forFeature([{name: User.name, schema: UserSchema}]),
    ],
    controllers: [CourseController],
    providers: [CourseService, FileService, MailService]
})
export class CourseModule{}