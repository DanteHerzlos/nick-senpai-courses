import AuthService from "../../../api/AuthService"
import { LoginDto } from "../../../dto/LoginDto"
import { RegistrationDto } from "../../../dto/RegistrationDto"
import { IUser } from "../../../types/IUser"
import { AppDispatch } from "../../store"
import { userSlice } from "./UserSlice"

export const authorization = (dto: LoginDto) => async (dispatch: AppDispatch) => {
  try {
    dispatch(userSlice.actions.setIsLoading(true))
    const {data} = await AuthService.login(dto)
    dispatch(userSlice.actions.setUser({
      email: data.email,
      userId: data.userId,
      username: data.username, 
      role: data.role,
      purchasedCourses: data.purchasedCourses
    }))
    localStorage.setItem('token', data.accessToken)
    dispatch(userSlice.actions.setIsAuth(true))
    dispatch(userSlice.actions.setError(''))

  } catch (e) { 
    dispatch(userSlice.actions.setError(e.response.data.message))
  }finally{
    dispatch(userSlice.actions.setIsLoading(false))
  } 
}


export const checkAuth = () => async (dispatch: AppDispatch) => {   
  try {
    dispatch(userSlice.actions.setIsLoading(true))
    const {data} = await AuthService.refresh()
    localStorage.setItem('token', data.accessToken)
    dispatch(userSlice.actions.setUser({
      email: data.email,
      userId: data.userId,
      username: data.username, 
      role: data.role,
      purchasedCourses: data.purchasedCourses
    }))   
    dispatch(userSlice.actions.setIsAuth(true))
    dispatch(userSlice.actions.setError(''))
  } catch (e) {
    dispatch(userSlice.actions.setError(e.response.data.message))
  }finally{
    dispatch(userSlice.actions.setIsLoading(false))
  }
} 

export const logout = () => async (dispatch: AppDispatch) => {   
  try {
    dispatch(userSlice.actions.setIsLoading(true))
    await AuthService.logout()
    localStorage.removeItem('token')
    dispatch(userSlice.actions.setUser({} as IUser))
    dispatch(userSlice.actions.setIsAuth(false))
    dispatch(userSlice.actions.setError(''))
  } catch (e) {
    dispatch(userSlice.actions.setError(e.response.data.message))
  }finally{
    dispatch(userSlice.actions.setIsLoading(false))
  }
}


export const registration = (dto: RegistrationDto) => async (dispatch: AppDispatch) => {   
  try {
    dispatch(userSlice.actions.setRegistrationLoading(true))
    await AuthService.registration(dto)
    dispatch(userSlice.actions.setError(''))
    return 'success'
  } catch (e) {
    dispatch(userSlice.actions.setError(e.response.data.message))
  } finally {
    dispatch(userSlice.actions.setRegistrationLoading(false))
  }
}
