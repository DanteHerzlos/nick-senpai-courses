import CourseService from "../../../api/CourseService"
import { AppDispatch } from "../../store"
import { courseSlice } from "../course/CourseSlice"

export const fetchCourses = () => async (dispatch: AppDispatch) => {
    try {
        dispatch(courseSlice.actions.courseFetching())
        const response = await CourseService.getCourses()
        dispatch(courseSlice.actions.courseFetchingSuccess(response.data))
    } catch (e) {
        dispatch(courseSlice.actions.courseFetchingError(e.message))
    }
}
