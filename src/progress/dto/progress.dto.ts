import { ObjectId } from "mongoose"

export class ProgressDto {
    readonly lessonId: ObjectId
    readonly userId: ObjectId
    readonly progress: number
}