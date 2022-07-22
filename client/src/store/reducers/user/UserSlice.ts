import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import {IUser} from '../../../types/IUser'

interface UserState {
  isAuth: boolean
  error: string
  isLoading: boolean
  registrationLoading: boolean
  user: IUser
}

const initialState: UserState = {
  isAuth: false,
  error: '',
  isLoading: false,
  registrationLoading: false,
  user: {} as IUser,
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setIsAuth(state, action: PayloadAction<boolean>){
      state.isAuth = action.payload
    },
    setIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload
    },
    setRegistrationLoading(state, action: PayloadAction<boolean>) {
      state.registrationLoading = action.payload
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload
    },
    setUser(state, action: PayloadAction<IUser>) {
      state.user = action.payload
    }
  }
})

export default userSlice.reducer