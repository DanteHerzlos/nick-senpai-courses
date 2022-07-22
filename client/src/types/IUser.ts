import { ICourse } from "./ICourse"

export interface IUser {
  userId: string
  username: string
  email: string
  role: string
  purchasedCourses: ICourse[]
} 