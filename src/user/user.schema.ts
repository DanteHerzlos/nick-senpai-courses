import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { Course } from '../course/course.schema'
import { Comment } from 'src/comment/comment.schema'
import * as mongoose from 'mongoose'
import { Token } from 'src/token/token.schema'


export type UserDocument = User & Document

@Schema({timestamps: true})
export class User {
  @Prop({required: true, unique: true})
  username: string

  @Prop({required: true})
  password: string

  @Prop({required: true, unique: true})
  email: string

  @Prop({required: true})
  role: string

  @Prop()
  avatarSrc: string

  @Prop()
  LastEnter: Date

  @Prop()
  resetPasswordToken: string

  @Prop()
  resetPasswordTokenExp: Date

  @Prop({type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Token'}]})
  refreshTokens: Token[]

  @Prop({type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Course'}]})
  courses: Course[]

  @Prop({type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}]})
  comments: Comment[]

  // @Prop({type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Progress'}]})
  // progresses: Progress[]

}

export const UserSchema = SchemaFactory.createForClass(User);