import { ObjectId } from "mongoose"

export class GetProgressDto {
    readonly lessonId: ObjectId
    readonly userId: ObjectId
}