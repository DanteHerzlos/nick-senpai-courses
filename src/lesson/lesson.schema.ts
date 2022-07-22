import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { Course } from '../course/course.schema'
import { Comment } from 'src/comment/comment.schema'
import * as mongoose from 'mongoose'
import { Progress } from 'src/progress/progress.schema'


export type LessonDocument = Lesson & Document

@Schema({timestamps: true})
export class Lesson {
  @Prop({required: true})
  title: string

  @Prop({required: true})
  lessonNumber: number

  @Prop({default: ''})
  videoSrc: string

  @Prop()
  draftJSBody: string
    
  @Prop({
    type: mongoose.Schema.Types.ObjectId, ref: 'Course', 
    required: true
  })
  courseId: Course

  @Prop({type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}]})
  comments: Comment[]

  @Prop({type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Progress'}]})
  progresses: Progress[]

}

export const LessonSchema = SchemaFactory.createForClass(Lesson);