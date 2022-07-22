import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Lesson, LessonSchema } from "src/lesson/lesson.schema";
import { User, UserSchema } from "src/user/user.schema";
import { ProgressController } from "./progress.controller";
import { Progress, ProgressSchema } from "./progress.schema";
import { ProgressService } from "./progress.service";

@Module({
    imports: [
        MongooseModule.forFeature([{name: Progress.name, schema: ProgressSchema}]),
        MongooseModule.forFeature([{name: Lesson.name, schema: LessonSchema}]),
        MongooseModule.forFeature([{name: User.name, schema: UserSchema}]),
    ],
    controllers: [ProgressController],
    providers: [ProgressService]
})
export class ProgressModule{}