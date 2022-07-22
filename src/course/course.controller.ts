import { Body, Controller, Delete, Get, Param, Post, Put, Query, UploadedFile,
    UseGuards,
    UseInterceptors } from "@nestjs/common"
import { FileInterceptor } from "@nestjs/platform-express"
import { ObjectId } from "mongoose"
import { Role } from "src/auth/enums/role.enum"
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard"
import { Roles } from "src/auth/roles.decorator"
import { CourseService } from "./course.service"
import { addCourseToUserDto } from "./dto/add-course-to-user.dto"
import { CreateCourseDto } from "./dto/create-course.dto"
import { UpdateCourseDto } from "./dto/update-course.dto"



@Controller('/api/courses')
export class CourseController {
    constructor (private courseService: CourseService){}

    @Post()
    @Roles(Role.Admin, Role.Editor)
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('imgCover'))
    create(
        @UploadedFile() imgCover: Express.Multer.File, 
        @Body() dto: CreateCourseDto
    ) {
        return this.courseService.create(dto, imgCover)
    }

    @Put('purchaseCourse')
    @Roles(Role.Admin, Role.Editor, Role.User)
    @UseGuards(JwtAuthGuard)
    addCourseToUser(
        @Body() dto: addCourseToUserDto
    ) {
        return this.courseService.addCourseToUser(dto)
    }

    @Post('sendMailForPayment')
    @Roles(Role.User, Role.Admin, Role.Editor)
    @UseGuards(JwtAuthGuard)
    sendMailForPayment(
        @Body() dto: addCourseToUserDto
    ) {
        return this.courseService.sendMailForPayment(dto)
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    getByType(@Query('type') type: string){
        if(!type){
            return this.courseService.getAll()
        }
        return this.courseService.getByType(type)
    }

    @Get('/names')
    @UseGuards(JwtAuthGuard)
    @Roles(Role.Admin)
    getOne(){
        return this.courseService.getAllNames()
    }

    @Put('/edit/:id')
    @Roles(Role.Admin, Role.Editor)
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('imgCover'))
    update(
        @UploadedFile() imgCover: Express.Multer.File, 
        @Param('id') id: ObjectId, 
        @Body() dto: UpdateCourseDto
    ){
        return this.courseService.update(id, dto, imgCover)
    }

    @Delete(':id')
    @Roles(Role.Admin, Role.Editor)
    @UseGuards(JwtAuthGuard)
    delete(@Param('id') id: ObjectId){
        return this.courseService.delete(id)
    }
}