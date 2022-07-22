import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { Course, CourseSchema } from "src/course/course.schema"
import { Progress, ProgressSchema } from "src/progress/progress.schema"
import { Token, TokenSchema } from "src/token/token.schema"
import { TokenService } from "src/token/token.service"
import { User, UserSchema } from "src/user/user.schema"
import { LessonController } from "./lesson.controller"
import { Lesson, LessonSchema } from "./lesson.schema"
import { LessonService } from "./lesson.service"


@Module({
    imports: [
        MongooseModule.forFeature([{name: Lesson.name, schema: LessonSchema}]),
        MongooseModule.forFeature([{name: Course.name, schema: CourseSchema}]),
        MongooseModule.forFeature([{name: Token.name, schema: TokenSchema}]),
        MongooseModule.forFeature([{name: User.name, schema: UserSchema}]),
        MongooseModule.forFeature([{name: Progress.name, schema:ProgressSchema}]),
    ],
    controllers: [LessonController],
    providers: [LessonService, TokenService]
})
export class LessonModule{}