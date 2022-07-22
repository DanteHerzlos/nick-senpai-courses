import { Body, Controller, Delete, Get, Headers, Param, Post, Put, Query, UseGuards } from '@nestjs/common'
import { ObjectId } from 'mongoose'
import { Role } from 'src/auth/enums/role.enum'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { Roles } from 'src/auth/roles.decorator'
import { ChangePasswordDto } from './dto/change-password-user.dto'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { UserService } from './user.service'

@Controller('/api/users')
export class UserController {
    constructor (
        private userService: UserService,
    ){}

    @Post('/registration')
    registration(
        @Body() dto: CreateUserDto
    ) {
        return this.userService.registration(dto)
    }

    @Get('/all')
    @UseGuards(JwtAuthGuard)
    @Roles(Role.Admin)
    getAll(
        @Query('page') page: number, 
        @Query('limit') limit: number,
        @Query('email_search') email: string
    ){
        return this.userService.getAll(page, limit, email)
    }

    
    @Put('/change_password')
    @UseGuards(JwtAuthGuard)
    changePassword(
        @Body() dto: ChangePasswordDto,
        @Headers('Authorization') token: string,
    ){
        return this.userService.changePassword(dto, token)
    }

    @Put('/:id/update')
    @UseGuards(JwtAuthGuard)
    @Roles(Role.Admin)
    update(@Param('id') id: ObjectId, @Body() dto: UpdateUserDto){
        return this.userService.update(id, dto)
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @Roles(Role.Admin)
    delete(@Param('id') id: ObjectId){
        return this.userService.delete(id)
    }
}