import { ICourse } from "../types/ICourse"

export interface UpdateUserInfo {
  role: string
  courses: ICourse[]
}