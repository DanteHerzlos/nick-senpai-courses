import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TokenService } from 'src/token/token.service';
import { User, UserDocument } from 'src/user/user.schema';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { Request, Response } from 'express';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { MailService } from 'src/mail/mail.service';
import { randomBytes } from 'crypto';
import { AcceptResetPasswordDto } from './dto/accept-reset-password.dto';



@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private UserModel: Model<UserDocument>,
        private tokenService: TokenService,
        private mailService: MailService,
    ){}

    async login(
        res: Response,
        dto: LoginUserDto,
        ipAddress: string, 
        userAgent: string
    ) {
        const {email, password} = dto
        const candidate = await this.UserModel
            .findOne({email: email.toLowerCase()})
            .populate('courses')

        if (!candidate){
            throw new HttpException(
                'Пользователь не был найден', 
                HttpStatus.FORBIDDEN
            )
        }

        const areSame = await bcrypt.compare(password, candidate.password)
        if(!areSame){
            throw new HttpException(
                'Неверный пароль', 
                HttpStatus.FORBIDDEN
            )
        }

        const tokens = this.tokenService.generateToken({
            userId: candidate._id, 
            role: candidate.role, 
            ipAddress, 
            userAgent
        })
        const token = await this.tokenService.saveToken(
            candidate._id, 
            tokens.refreshToken
        )
        
        res.cookie(
            'refreshToken', 
            tokens.refreshToken, 
            {maxAge: 30 * 24 * 60 * 60* 1000, httpOnly: true}
        )
        
        return ({
            ...tokens, 
            email: candidate.email,
            userId: candidate._id, 
            username: candidate.username, 
            role: candidate.role,
            purchasedCourses: candidate.courses
        })
    }

    async logout(req: Request, res: Response) {
        const {refreshToken} = req.cookies
        res.clearCookie('refreshToken') 
        const token = await this.tokenService.removeToken(refreshToken)
        return token
    }

    async refresh(req: Request,res: Response, ipAddress: string, userAgent: string) {
        const {refreshToken} = req.cookies
        if (!refreshToken){
            throw new UnauthorizedException()
        }
        
        const userData = this.tokenService.validateRefreshToken(refreshToken)
        const tokenFromDB = this.tokenService.findToken(refreshToken)
        if (!userData || ! tokenFromDB){
            throw new UnauthorizedException()
        }

        const user = await this.UserModel
            .findById({_id: userData['userId']})
            .populate('courses', ['_id', 'title', 'imgCoverSrc', 'description'])       
        const tokens = this.tokenService.generateToken({
            userId: user._id,
            role: user.role, 
            userAgent, 
            ipAddress
        })
        
        await this.tokenService.updateToken(refreshToken, tokens.refreshToken)

        res.cookie(
            'refreshToken', 
            tokens.refreshToken, 
            {maxAge: 30 * 24 * 60 * 60* 1000, httpOnly: true}
        )

        return ({
            ...tokens, 
            email: user.email,
            userId: user._id, 
            username: user.username, 
            role: user.role,
            purchasedCourses: user.courses
        })
    }

    async resetPassword(dto: ResetPasswordDto){

        const candidate = await this.UserModel.findOne({email: dto.email})
        if(!candidate){
            // throw new HttpException(
            //     'Нет такого пользователя', 
            //     HttpStatus.FORBIDDEN
            // )
            return 'Сообщение было высланно на указанный почтовый ящик'
        }

        if(
            candidate.resetPasswordTokenExp && 
            candidate.resetPasswordTokenExp > new Date(Date.now())
        ){
            return 'Сообщение уже было высланно на указанный почтовый ящик'

        }
        const resetPasswordToken = randomBytes(32).toString("hex")
        candidate.resetPasswordToken = resetPasswordToken
        candidate.resetPasswordTokenExp = new Date(Date.now() + 60*60*1000)

        await candidate.save()
        
        this.mailService.sendMail(candidate.email, candidate.username, resetPasswordToken)
        

        return 'Сообщение было высланно на указанный почтовый ящик'
    }

    async resetPasswordLink(token: string) {
        const candidate = await this.UserModel.findOne(
            {
                resetPasswordToken: token,
                resetPasswordTokenExp: {$gt: Date.now()}
            }
        )
        
        if(!candidate) {
            throw new HttpException(
                'Неверная ссылка или истекло время действия', 
                HttpStatus.FORBIDDEN
            )
        }
        return 'success'
    }

    
    async acceptResetPassword(token: string, dto: AcceptResetPasswordDto) {
        const candidate = await this.UserModel.findOne(
            {
                resetPasswordToken: token,
                resetPasswordTokenExp: {$gt: Date.now()}
            }
        )
        
        if(!candidate) {
            throw new HttpException(
                'Неверная ссылка или истекло время действия', 
                HttpStatus.FORBIDDEN
            )
        }
        
        if(!dto.password.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)){
            throw new HttpException(
                'Пароль не удовлетворяет требованиям!', 
                HttpStatus.FORBIDDEN
            )
        }

        const encryptPassword = bcrypt.hashSync(dto.password, 5)

        candidate.password = encryptPassword
        candidate.resetPasswordToken = ''
        candidate.resetPasswordTokenExp = new Date( Date.now() )
        await candidate.save()

        return 'access'
    }

}
