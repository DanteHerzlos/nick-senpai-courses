import { HttpException, HttpStatus, Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { randomBytes } from "crypto"
import { Model, ObjectId } from "mongoose"
import { FileService, FileType } from "src/file/file.service"
import { MailService } from "src/mail/mail.service"
import { User, UserDocument } from "src/user/user.schema"
import { Course, CourseDocument } from "./course.schema"
import { addCourseToUserDto } from "./dto/add-course-to-user.dto"
import { CreateCourseDto } from "./dto/create-course.dto"
import { UpdateCourseDto } from "./dto/update-course.dto"


@Injectable()
export class CourseService{
    constructor(
        @InjectModel(Course.name) private CourseModel: Model<CourseDocument>,
        @InjectModel(User.name) private UserModel: Model<UserDocument>,
        private fileService: FileService,
        private mailService: MailService
    ) {}
    
    async create(
        dto: CreateCourseDto, 
        imgCover: Express.Multer.File
    ): Promise<Course> {  
        const imgCoverSrc = this.fileService.createFile(FileType.COVER, imgCover)
        const course = await this.CourseModel.create({...dto, imgCoverSrc})
        return course
    }

    async sendMailForPayment(dto: addCourseToUserDto){
        console.log(dto);
        
        const course = await this.CourseModel.findById(dto.courseId)
        const user = await this.UserModel.findById(dto.userId)

        if(!user){
            throw new HttpException(
                'Пользователь не был найден', 
                HttpStatus.FORBIDDEN
            )
        }

        if(!course){
            throw new HttpException(
                'Курс не был найден', 
                HttpStatus.FORBIDDEN
            )
        }
        
        if(user.courses.includes(course._id)){
            throw new HttpException(
                'Курс уже приобретен!', 
                HttpStatus.FORBIDDEN
            )
        }

        const payUrl = randomBytes(32).toString("hex")


        await this.mailService.sendMailForPaymentInfo(
            user.email, 
            user.username,
            payUrl,
            course._id,
            course.title
        )

        return 'На почту отправленно сообщение с инструкцией для оплаты'

    }

    async addCourseToUser(dto: addCourseToUserDto) {
        const course = await this.CourseModel.findById(dto.courseId)
        const user = await this.UserModel.findById(dto.userId)
        
        if(!user){
            throw new HttpException(
                'Пользователь не был найден', 
                HttpStatus.FORBIDDEN
            )
        }

        if(!course){
            throw new HttpException(
                'Курс не был найден', 
                HttpStatus.FORBIDDEN
            )
        }
        
        if(user.courses.includes(course._id)){
            throw new HttpException(
                'Курс уже был приобретен', 
                HttpStatus.FORBIDDEN
            )
        }
        //module for check payment transaction
        //dto.hash
        //
        course.users.push(user._id)
        user.courses.push(course._id)
        const courseUpdate = await course.save()
        const userUpdate = await user.save()
        return {courseUpdate, userUpdate}
    }

    async getAllNames(): Promise<Course[]> {
        const courses = await this.CourseModel.find().select('title _id')
        return courses
    }

    async getAll(): Promise<Course[]>{
        const courses = await this.CourseModel.find()
        return courses
    }

    async getByType(type: string): Promise<Course[]>{
        const courses = await this.CourseModel.find({type})
        return courses
    }
    
    async getOne(id: ObjectId): Promise<Course>{
        const course = await this.CourseModel.findById(id)
        return course
    }

    async update(
        id: ObjectId, 
        dto: UpdateCourseDto, 
        imgCover: Express.Multer.File
    ): Promise<Course>{ 
        const oldCourse = await this.CourseModel.findOne({_id: id})

        const imgCoverSrc = 
        imgCover ? 
        this.fileService.updateFile(
            FileType.COVER,
            imgCover, 
            oldCourse.imgCoverSrc) 
        : ''

        const filter = { _id: id }
        const update = imgCoverSrc ? { ...dto, imgCoverSrc } :  { ...dto }
        const course = await this.CourseModel.findOneAndUpdate(filter, update, {
            returnOriginal: false
        })
        return course
    }
 
    async delete(id: ObjectId): Promise<ObjectId>{
        const {imgCoverSrc} = await this.CourseModel.findById(id)
        this.fileService.removeFile(imgCoverSrc)
        const course = await this.CourseModel.findByIdAndDelete(id)
        
        return course._id
    }
}