import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import {ICourse} from '../../../types/ICourse'

interface CourseState {
  error: string
  isLoading: boolean
  courses: ICourse[]
}

const initialState: CourseState = {
  error: '',
  isLoading: false,
  courses: []
}

export const courseSlice = createSlice({
  name: 'course',
  initialState,
  reducers: {
    courseFetching(state){
      state.isLoading = true
    },
    courseFetchingSuccess(state, action: PayloadAction<ICourse[]>){
      state.isLoading = false
      state.courses = action.payload
      state.error = ''
    },
    courseFetchingError(state, action: PayloadAction<string> ){
      state.error = action.payload
      state.isLoading = false
    }
  }
})

export default courseSlice.reducer