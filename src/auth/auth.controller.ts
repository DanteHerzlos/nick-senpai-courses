import { Body, Controller, Get, Headers, Ip, Param, Post, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { AcceptResetPasswordDto } from "./dto/accept-reset-password.dto";
import { LoginUserDto } from "./dto/login-user.dto";
import { ResetPasswordDto } from "./dto/reset-password.dto";

@Controller('/api/auth')
export class AuthController {
    constructor (private authService: AuthService){}

    @Post('/login')
    login(
        @Res({ passthrough: true }) res: Response,
        @Ip() IpAddress: string,
        @Headers('User-Agent') userAgent: string,
        @Body() dto: LoginUserDto
    ) {
        return this.authService.login(res, dto, IpAddress, userAgent)
    }

    @Post('/logout')
    logout(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response
    ) {
        return this.authService.logout(req, res)
    }
    
    @Get('/refresh')
    refresh(
        @Res({ passthrough: true }) res: Response,
        @Ip() IpAddress: string,
        @Headers('User-Agent') userAgent: string,
        @Req() req: Request, 
    ) {
        return this.authService.refresh(req, res, IpAddress, userAgent)
    }

    @Get('/reset_password/:token')
    resetPasswordLink(
        @Param('token') token: string
    ) {
        return this.authService.resetPasswordLink(token)
    }

    @Post('/reset_password')
    resetPassword(
        @Body() dto: ResetPasswordDto
    ) {
        return this.authService.resetPassword(dto)
    }

    @Post('/reset_password/:token')
    acceptResetPassword(
        @Param('token') token: string,
        @Body() dto: AcceptResetPasswordDto
    ) {
        return this.authService.acceptResetPassword(token, dto)
    }
    
}