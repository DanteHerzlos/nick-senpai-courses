import { Course } from "src/course/course.schema"

export class UpdateUserDto {
    readonly role: string
    readonly courses: Course[]
}
