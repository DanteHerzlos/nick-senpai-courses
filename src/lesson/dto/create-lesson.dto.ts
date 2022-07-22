import { ObjectId } from "mongoose"

export class CreateLessonDto {
    readonly title: string
    readonly lessonNumber: string
    readonly videoSrc: string
    readonly draftJSBody: string
    readonly courseId: ObjectId   
}