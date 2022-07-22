import LessonService from "../../../api/LessonService"
import { AppDispatch } from "../../store"
import { lessonSlice } from "./LessonSlice"

export const fetchLessonsByCourseId = (courseId: string) => async (dispatch: AppDispatch) => {
    try {
        dispatch(lessonSlice.actions.lessonFetching())
        const response = await LessonService.getLessonsByCourseId(courseId)
        dispatch(lessonSlice.actions.lessonFetchingSuccess(response.data))
    } catch (e) {
        dispatch(lessonSlice.actions.lessonFetchingError(e.message))
    }
}
