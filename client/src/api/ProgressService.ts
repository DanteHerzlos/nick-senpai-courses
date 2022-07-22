import { AxiosResponse } from "axios";
import { $authHost } from ".";
import { CoursesProgressDto } from "../dto/CoursesProgressDto";
import { ProgressDto } from "../dto/ProgressDto";

export default class ProgressService {
  static async changeProgress(dto: ProgressDto){
    return await $authHost.put('/progress', dto, {withCredentials: true})
  }

  static async getCoursesProgress(userId: string):
    Promise<AxiosResponse<CoursesProgressDto[]>>
  {
    return await $authHost.get(`/progress/user/${userId}`, {withCredentials: true})
  }
}