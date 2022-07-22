import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from './reducers/user/UserSlice'
import courseReducer from './reducers/course/CourseSlice'
import lessonReducer from './reducers/lesson/LessonSlice'


const rootReducer = combineReducers({
  userReducer,
  courseReducer,
  lessonReducer
})

export const setupStore = () => {
  return configureStore({
     reducer: rootReducer
  })
}

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']