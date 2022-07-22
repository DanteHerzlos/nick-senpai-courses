import { AxiosResponse } from "axios";
import { $authHost, $host } from ".";
import { AcceptResetPasswordDto } from "../dto/AcceptResetPasswordDto";
import { LoginDto } from "../dto/LoginDto";
import { RegistrationDto } from "../dto/RegistrationDto";
import { ResetPasswordDto } from "../dto/ResetPasswordDto";

export default class AuthService {
  static async login(dto: LoginDto){
    return await $host.post('/auth/login', dto, {withCredentials: true})
  }

  static async logout(){
    return await $authHost.post('/auth/logout', {withCredentials: true})
  }

  static async refresh(){
    return await $host.get('/auth/refresh', {withCredentials: true})
  }

  static async registration(dto: RegistrationDto){
    return await $host.post('/users/registration', dto)
  }

  static async reset_password(dto: ResetPasswordDto):Promise<AxiosResponse>{
    return await $host.post('/auth/reset_password', dto)
  }

  static async reset_password_link(token: string):Promise<AxiosResponse>{
    return await $host.get(`/auth/reset_password/${token}`)
  }

  static async accept_reset_password(
    token: string, 
    dto: AcceptResetPasswordDto
  ):Promise<AxiosResponse>
  {
    return await $host.post(`/auth/reset_password/${token}`, dto)
  }

}