export enum Role {
  User = 'user',
  Admin = 'admin',
  Editor = 'editor'
}

//Courses rules
export const canAddNewCourses:string[] = [Role.Admin, Role.Editor ]
export const canEditCourse:string[] = [Role.Admin, Role.Editor ]
export const canDeleteCourse:string[] = [Role.Admin, Role.Editor ]

//Lessons rules
export const canAddLesson:string[] = [Role.Admin, Role.Editor ]
export const canEditLesson:string[] = [Role.Admin, Role.Editor ]
export const canDeleteLesson:string[] = [Role.Admin, Role.Editor ]
