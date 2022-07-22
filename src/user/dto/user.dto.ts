import { Course } from "src/course/course.schema"

class Users {
    readonly username: string
    readonly email: string
    readonly role: string
    readonly userId: string
    readonly purchasedCourses: Course[]
}

export class UsersDto {
    readonly totalCount: number
    readonly users: Users[]
}
