import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { User } from 'src/user/user.schema'
import { Lesson } from 'src/lesson/lesson.schema'
import * as mongoose from 'mongoose'

export type CommentDocument = Comment & Document

@Schema({timestamps: true})
export class Comment {
  @Prop()
  body: string

  @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User'})
  user: User
    
  @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Lesson'})
  course: Lesson

  @Prop({type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}]})
  comments: Comment[]
}

export const CommentSchema = SchemaFactory.createForClass(Comment);