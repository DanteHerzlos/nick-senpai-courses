import { Body, Controller, Delete, Get, Headers, Param, Post, Put, UseGuards } from "@nestjs/common"
import { ObjectId } from "mongoose"
import { Role } from "src/auth/enums/role.enum"
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard"
import { Roles } from "src/auth/roles.decorator"
import { CreateLessonDto } from "./dto/create-lesson.dto"
import { UpdateLessonDto } from "./dto/update-lesson.dto"
import { LessonService } from "./lesson.service"


@Controller('/api/courses/:course_id/lessons')
export class LessonController {
    constructor (private lessonService: LessonService){}

    @Get()
    @UseGuards(JwtAuthGuard)
    getByCourseId(
        @Param('course_id') courseId: ObjectId,
        @Headers('Authorization') token: string,
    ){
        return this.lessonService.getByCourseId(courseId, token)
    }

    @Post()
    @Roles(Role.Admin, Role.Editor)
    @UseGuards(JwtAuthGuard)
    create(
        @Param('course_id') courseId: ObjectId,
        @Body() dto: CreateLessonDto) 
    {
        return this.lessonService.create(courseId, dto)
    }

    @Put('/edit/:lesson_id')
    @Roles(Role.Admin, Role.Editor)
    @UseGuards(JwtAuthGuard)
    update(
        @Param('lesson_id') lessonId: ObjectId, 
        @Body() dto: UpdateLessonDto
    ){
        return this.lessonService.update(lessonId, dto)
    }

    @Delete('/:lesson_id')
    @Roles(Role.Admin, Role.Editor)
    @UseGuards(JwtAuthGuard)
    delete(@Param('lesson_id') lessonId: ObjectId){
        return this.lessonService.delete(lessonId)
    }
}