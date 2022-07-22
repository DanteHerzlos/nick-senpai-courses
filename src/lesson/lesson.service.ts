import { HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model, ObjectId } from "mongoose"
import { Course, CourseDocument } from "src/course/course.schema"
import { MailService } from "src/mail/mail.service"
import { Progress, ProgressDocument } from "src/progress/progress.schema"
import { TokenService } from "src/token/token.service"
import { User, UserDocument } from "src/user/user.schema"
import { CreateLessonDto } from "./dto/create-lesson.dto"
import { UpdateLessonDto } from "./dto/update-lesson.dto"
import { Lesson, LessonDocument } from "./lesson.schema"


@Injectable()
export class LessonService{
    constructor(
        @InjectModel(Lesson.name) private LessonModel: Model<LessonDocument>,
        @InjectModel(Course.name) private CourseModel: Model<CourseDocument>,
        @InjectModel(User.name) private UserModel: Model<UserDocument>,
        @InjectModel(Progress.name) private ProgressModel: Model<ProgressDocument>,
        private tokenService: TokenService,
    ) {}
    
    async create(courseId: ObjectId, dto: CreateLessonDto): Promise<Lesson> {
        const course = await this.CourseModel.findById(courseId)
        if(!course){
            throw new HttpException(
                'Курс не был найден', 
                HttpStatus.FORBIDDEN
            )
        }
        const lesson = await this.LessonModel.create({
            ...dto, 
            courseId: course._id
        })
        course.lessons.push(lesson._id)
        await course.save()
        return lesson
    }

    async getByCourseId(courseId: ObjectId, token: string): Promise<Lesson[]>{
        const user_data = this.tokenService.validateAccessToken(token.split(' ')[1])
        const user = await this.UserModel.findOne({
            _id: user_data.userId, 
            courses: courseId
        })
        if(!user){
            throw new UnauthorizedException()
        }
        const lessons = await this.LessonModel
            .find({courseId})
            .sort({lessonNumber: 1})
            .populate('courseId', 'title')
            .populate({
                path: 'progresses', 
                select: 'progress',
                match: {user: user._id}
            })
            .select('courseId title lessonNumber _id videoSrc draftJSBody progress') 
        return lessons
    }


    async update(id:ObjectId, dto: UpdateLessonDto): Promise<Lesson>{         
        const filter = { _id: id }
        const update = { ...dto }
        const lesson = await this.LessonModel.findOneAndUpdate(
            filter, update, 
            { returnOriginal: false }
        )
        
        return lesson
    }

    async delete(id: ObjectId): Promise<ObjectId>{
        const lesson = await this.LessonModel.findByIdAndDelete(id)
        const course = await this.CourseModel.findById(lesson.courseId)
        course.lessons.filter(id => id !== lesson.id)
        await course.save()
        return lesson._id
    }
}