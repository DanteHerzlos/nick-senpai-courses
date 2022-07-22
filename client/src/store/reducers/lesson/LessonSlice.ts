import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { ILesson } from "../../../types/ILesson"

interface LessonState {
  error: string
  isLoading: boolean
  lessons: ILesson[]
}

const initialState: LessonState = {
  error: '',
  isLoading: false,
  lessons: []
}

export const lessonSlice = createSlice({
  name: 'lesson',
  initialState,
  reducers: {
    lessonFetching(state){
      state.isLoading = true
    },
    lessonFetchingSuccess(state, action: PayloadAction<ILesson[]>){
      state.isLoading = false
      state.lessons = action.payload
      state.error = ''
    },
    lessonFetchingError(state, action: PayloadAction<string> ){
      state.error = action.payload
      state.isLoading = false
    }
  }
})

export default lessonSlice.reducer