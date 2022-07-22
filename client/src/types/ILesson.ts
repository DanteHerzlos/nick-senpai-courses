import { ICourse } from "./ICourse"

interface IProgress {
  progress: number
}

export interface ILesson {
  courseId: ICourse
  _id: string
  title: string
  lessonNumber: string
  videoSrc: string
  draftJSBody: string
  progresses: IProgress[]
}