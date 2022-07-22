import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, ObjectId } from 'mongoose'
import { CreateUserDto } from './dto/create-user.dto'
import { FindOneUserDto } from './dto/findOne-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { User, UserDocument } from './user.schema'
import * as bcrypt from 'bcrypt'
import { Role } from 'src/auth/enums/role.enum'
import { ChangePasswordDto } from './dto/change-password-user.dto'
import { TokenService } from 'src/token/token.service'
import { UsersDto } from './dto/user.dto'

@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private tokenService: TokenService,
    ) {}
    
    async registration(
        dto: CreateUserDto
    ): Promise<User> {      
        const {email, username, password} = dto
        const userRegx = new RegExp(username.trim(), 'gi' )   
        const isEmail = await this.userModel
            .findOne({email: email.toLowerCase().trim()})
        const isUsername = await this.userModel
            .findOne({username: userRegx })
        if(isEmail){
            throw new HttpException(
                'Такой email уже зарегистрирован!', 
                HttpStatus.FORBIDDEN
            )
        }
        if(isUsername){
            throw new HttpException(
                'Такоe имя уже занято!', 
                HttpStatus.FORBIDDEN
            )
        }

        if(!password.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)){
            throw new HttpException(
                'Пароль не удовлетворяет требованиям!', 
                HttpStatus.FORBIDDEN
            )
        }
        const encryptPassword = bcrypt.hashSync(password, 5)
        
        const user = await this.userModel.create({
            email: email.toLowerCase(), 
            password: encryptPassword, 
            username, 
            role: Role.User
        })
        return user
    }

    async create(dto: CreateUserDto): Promise<User> {
        const user = await this.userModel.create({...dto})
        return user
    }

    async getAll(
        page: number, 
        limit: number, 
        email: string
    ): Promise<UsersDto>{
        const emailRegx = new RegExp(email, 'gi' )   
        const users = await this.userModel
            .find({email: emailRegx})
            .populate('courses', 'title')
            .select('courses _id username email role')
            .sort('email')
            .skip((page-1)*limit)
            .limit(limit)

        const totalCount = await this.userModel
            .find({email: emailRegx})
            .count()

        const data ={totalCount, users: users.map(d => {
            return {
                userId: d._id,
                purchasedCourses: d.courses,
                email: d.email,
                role: d.role,
                username: d.username
            }
        })}

        return data
    }


    async findOne(dto: FindOneUserDto): Promise<User | undefined>{
        const user = await this.userModel.findOne({...dto})
        return user
    }

    async findByEmail(email: string): Promise<User | undefined>{
        const user = await this.userModel.findOne({email})
        return user
    }

    async findById(id: string): Promise<User | undefined>{
        const user = await this.userModel.findById(id)
        return user
    }

    async changePassword( dto: ChangePasswordDto ,token: string ){
        const user_data = this.tokenService.validateAccessToken(token.split(' ')[1])     
        const user = await this.userModel.findById(user_data.userId)

        if(!user){
            throw new UnauthorizedException()
        }

        const areSame = await bcrypt.compare(dto.old_password, user.password)
        if(!areSame){
            throw new HttpException(
                'Неверный пароль', 
                HttpStatus.FORBIDDEN
            )
        }

        if(!dto.new_password.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)){
            throw new HttpException(
                'Пароль не удовлетворяет требованиям!', 
                HttpStatus.FORBIDDEN
            )
        }

        const encryptPassword = bcrypt.hashSync(dto.new_password, 5)

        user.password = encryptPassword
        user.save()

        return 'Успешная смена пароля!'
    }

    async update(id: ObjectId, dto: UpdateUserDto){
        const user = await this.userModel.findById(id)
        if(!user) {
            throw new HttpException(
                'Пользователь не найден', 
                HttpStatus.FORBIDDEN
            )
        }
        user.role = dto.role
        user.courses = dto.courses
        await user.save()
    }

    async delete(id: ObjectId): Promise<ObjectId>{
        const user = await this.userModel.findByIdAndDelete(id)
        return user._id
    }
    
}