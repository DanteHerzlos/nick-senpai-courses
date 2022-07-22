import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { User } from '../user/user.schema'
import { Lesson } from 'src/lesson/lesson.schema'
import * as mongoose from 'mongoose'


export type CourseDocument = Course & Document;

@Schema({timestamps: true})
export class Course {
  @Prop({required: true})
  title: string

  @Prop()
  imgCoverSrc: string

  @Prop()
  description: string

  @Prop({required: true})
  type: string

  @Prop()
  draftJSBodyIntro: string

  @Prop()
  introVideoSrc: string

  @Prop({type: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]})
  users: User[]

  @Prop({type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Lesson'}]})
  lessons: Lesson[]

}

export const CourseSchema = SchemaFactory.createForClass(Course)