import { AxiosResponse } from "axios"
import { $authHost} from "./index"
import { ICourse } from "../types/ICourse"
import { PurchaseCourseDto } from "../dto/PurchaseCourseDto"

export default class CourseService {
  static async getCourses():Promise<AxiosResponse<ICourse[]>>{
    return await $authHost.get('/courses')
  }
  static async postCourse(fd:FormData){
    return await $authHost.post('/courses', fd)
  }
  static async removeCourse(id:string){
    return await $authHost.delete(`/courses/${id}`)
  }
  static async updateCourse(id:string, fd:FormData){
    return await $authHost.put(`/courses/edit/${id}`, fd)
  }

  static async sendMailForPayment(dto: PurchaseCourseDto):Promise<AxiosResponse<string>>{
    return await $authHost.post(`/courses/sendMailForPayment`, dto)
  }

  static async purchaseCourse(dto: PurchaseCourseDto):Promise<AxiosResponse<string>>{
    return await $authHost.put(`/courses/purchaseCourse`, dto)
  }
}