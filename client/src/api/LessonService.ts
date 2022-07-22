import { AxiosResponse } from "axios";
import { $authHost } from ".";
import { LessonAddNewDto } from "../dto/LessonAddNewDto";
import { ILesson } from "../types/ILesson";

export default class LessonService {
  static async getLessonsByCourseId(courseId: string):Promise<AxiosResponse<ILesson[]>>{
    return await $authHost.get(`courses/${courseId}/lessons`)
  }

  static async postLesson(dto: LessonAddNewDto, courseId: string){
    return await $authHost.post(`/courses/${courseId}/lessons`, dto)
  }

  static async updateLesson(dto: LessonAddNewDto, courseId: string, lessonId: string){
    return await $authHost.put(`/courses/${courseId}/lessons/edit/${lessonId}`, dto)
  }

  static async removeLesson(id:string){
    return await $authHost.delete(`/courses/:id/lessons/${id}`)
  }
}