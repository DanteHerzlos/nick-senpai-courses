import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Lesson, LessonDocument } from "src/lesson/lesson.schema";
import { User, UserDocument } from "src/user/user.schema";
import { ProgressDto } from "./dto/progress.dto";
import { Progress, ProgressDocument } from "./progress.schema";

@Injectable()
export class ProgressService{
    constructor(
        @InjectModel(Lesson.name) private LessonModel: Model<LessonDocument>,
        @InjectModel(User.name) private UserModel: Model<UserDocument>,
        @InjectModel(Progress.name) private ProgressModel: Model<ProgressDocument>,
    ) {}

    async changeProgress(dto: ProgressDto ){
        const progress = await this.ProgressModel.findOne({
            user: dto.userId, 
            lesson: dto.lessonId
        })
        const user = await this.UserModel.findById(dto.userId)
        const lesson = await this.LessonModel.findById(dto.lessonId)

        if(!user || !lesson) {
            throw new HttpException(
                'Не найден пользователь или урок', 
                HttpStatus.FORBIDDEN
            )
        }
        //if exist create new
        if(!progress){
            const newProgress = await this.ProgressModel.create({
                user: dto.userId,
                lesson: dto.lessonId,
                progress: dto.progress
            })
            lesson.progresses.push(newProgress._id)
            await lesson.save()
            return newProgress
        }
        if(progress.progress < dto.progress){
            progress.progress = dto.progress
            progress.save()
        }
        return progress
         
    }

    async getProgressesByUserAndCourses(id: string){
        const user = await this.UserModel
            .findById(id)
            .populate({
                path: 'courses', 
                select: 'lessons title',
                populate: {
                    path: 'lessons',
                    model: 'Lesson',
                    select: 'progresses',
                    populate: {
                        path: 'progresses',
                        model: 'Progress',
                        match: {user: id},
                        select: 'progress',
                    }
                }
            })
            .select('courses')
        if(!user){
            throw new HttpException(
                'Не найден пользователь', 
                HttpStatus.FORBIDDEN
            )
        }
        const totalProgresses = user.courses.map(
            course => { return {
                _id: course['_id'], 
                title: course.title,
                progress: course.lessons.reduce(
                    (prev, curr, _, {length}) => curr.progresses.length === 1 ? 
                        prev + curr.progresses[0].progress/length : 
                        prev + 0, 0
                )
            }}
        )
        return totalProgresses
    }   

}