import { $authHost } from ".";
import { ChangePasswordDto } from "../dto/ChangePasswordDto";

export default class UserService {
  static async changePassword( dto:  ChangePasswordDto){   
    return await $authHost.put(
      `/users/change_password`, 
      dto, 
      {withCredentials: true}
    )
  }
}