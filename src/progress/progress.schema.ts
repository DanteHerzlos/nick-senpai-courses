import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { User } from '../user/user.schema'
import { Lesson } from 'src/lesson/lesson.schema'
import * as mongoose from 'mongoose'


export type ProgressDocument = Progress & Document;

@Schema({timestamps: true})
export class Progress {
  @Prop({default: 0})
  progress: number

  @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User'})
  user: User

  @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Lesson'})
  lesson: Lesson

}

export const ProgressSchema = SchemaFactory.createForClass(Progress)