import { AxiosResponse } from "axios";
import { $authHost } from ".";
import { UpdateUserInfo } from "../dto/UpdateUserInfo";
import { UsersDto } from "../dto/UsersDto";
import { ICourse } from "../types/ICourse";

export default class AdminService {
  static async getAllUsers(limit?: number, page?: number, email_search?: string):
    Promise<AxiosResponse<UsersDto>>{   
    return await $authHost.get(
      `/users/all`,
      { params: { page, limit, email_search }, withCredentials: true},
    )
  }

  static async getAllСoursesName():Promise<AxiosResponse<ICourse[]>>{   
    return await $authHost.get(`/courses/names`, {withCredentials: true})
  }

  static async updateUserInfo(id: string, dto: UpdateUserInfo){
    return await $authHost.put(`/users/${id}/update`, dto, {withCredentials: true})
  }

  static async deleteUser(id: string){
    return await $authHost.delete(`/users/${id}`, {withCredentials: true})
  }
}