import { Body, Controller, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { Role } from "src/auth/enums/role.enum";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { Roles } from "src/auth/roles.decorator";
import { ProgressDto } from "./dto/progress.dto";

import { ProgressService } from "./progress.service";

@Controller('/api/progress')
export class ProgressController {
    constructor (private progressService: ProgressService){}

    @Put()
    @Roles(Role.Admin, Role.Editor, Role.User)
    @UseGuards(JwtAuthGuard)
    changeProgress(@Body() dto: ProgressDto){
        return this.progressService.changeProgress(dto)
    }

    @Get('/user/:id')
    @Roles(Role.Admin, Role.Editor, Role.User)
    @UseGuards(JwtAuthGuard)
    getProgressesByUserAndCourses(@Param('id') id: string){
        return this.progressService.getProgressesByUserAndCourses(id)
    }
}
