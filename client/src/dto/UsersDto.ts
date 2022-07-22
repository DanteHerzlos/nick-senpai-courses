import { IUser } from "../types/IUser"

export interface UsersDto {
  totalCount: number
  users: IUser[]
}