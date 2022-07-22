import React from 'react'
import About from "../pages/About/About"
import Course from "../pages/Course/Course"
import Lesson from "../pages/Lesson/Lesson"
import LessonsList from "../pages/LessonsList/LessonsList"
import UserProfile from "../pages/UserProfile/UserProfile"
import CourseAdd from "../pages/CourseAdd/CourseAdd"
import MyCourses from "../pages/MyCourses/MyCourses"
import Login from "../pages/Login/Login"
import Registration from "../pages/Registration/Registration"
import ResetPassword from "../pages/ResetPassword/ResetPassword"
import Courses, { CourseTypes } from "../pages/Courses/Courses"
import CourseEdit from "../pages/CourseEdit/CourseEdit"
import { Link, RouteProps } from "react-router-dom"
import { 
  AppstoreOutlined, 
  FireOutlined, 
  HomeOutlined, 
  KeyOutlined, 
  UserOutlined, 
  WalletOutlined 
} from "@ant-design/icons"
import LessonAdd from '../pages/LessonAdd/LessonAdd'
import LessonEdit from '../pages/LessonEdit/LessonEdit'
import ResetPasswordForm from '../pages/ResetPasswordForm/ResetPasswordForm'
import DealPay from '../pages/DealPay/DealPay'



interface sidebarProps {
  label: React.ReactNode
  key: React.Key
  icon?: React.ReactNode
  children?: sidebarProps[]
}


export const privateSidebar:sidebarProps[] = [
  { label: <Link to='/'>Главная</Link>, key: '1', icon: <HomeOutlined />},
  { label: <Link to='/courses'>Все курсы</Link>, key: '2', icon: <AppstoreOutlined />},
  { label: <Link to='/marathones'>Все марафоны</Link>, key: '3', icon: <FireOutlined />},
  { label: <Link to='/user_courses'>Мои курсы</Link>, key: '4', icon: <WalletOutlined />},
  { label: 'Профиль' , key: '6', icon: <UserOutlined/>, children:
    [
      { label: <Link to='/user_profile'>Личный Кабинет</Link>, key: '0' },
      { label: "Выход", key: '9'}
    ]
  }  
]

export const adminMenu: sidebarProps = { 
  label: <Link to='/admin'>Админ</Link>, key: '5', icon: <KeyOutlined />
}

export const publicSidebar:sidebarProps[] = [
  { label: <Link to='/'>Главная</Link>, key: '1', icon: <HomeOutlined />},
  { label: <Link to='/login'>Войти</Link>, key: '2', icon: <AppstoreOutlined />},
  { label: <Link to='/registration'>Регистрация</Link>, key: '3', icon: <WalletOutlined />},
]

export const privateRoutes:RouteProps[]  = [
    { path: '/', element: <About/>},
    { path: '/courses', element: <Courses type={CourseTypes.COURSE}/>},
    { path: '/dealPay/:courseId/:hash', element: <DealPay />},
    { path: '/marathones', element: <Courses type={CourseTypes.MARATHON}/>},
    { path: '/courses/:id', element: <Course/> },
    { path: '/courses/new', element: <CourseAdd/> },
    { path: '/courses/edit/:id', element: <CourseEdit/> },
    { path: '/user_courses', element: <MyCourses/>},
    { path: '/user_courses/:courseId/lessons', element: <LessonsList/> },
    { path: '/user_courses/:courseId/lessons/:lessonId', element: <Lesson/> },
    { path: '/user_courses/:courseId/lessons/new', element: <LessonAdd/> },
    { path: '/user_courses/:courseId/lessons/:lessonId/edit', element: <LessonEdit/> },
    { path: '/user_profile', element: <UserProfile/> },
    { path: '*', element: <About/> }
]

export const publicRoutes:RouteProps[] = [
    { path: '/', element: <About/> },
    { path: '/login', element: <Login/> },
    { path: '/reset_password', element: <ResetPassword  />},
    { path: '/reset_password/:token', element: <ResetPasswordForm/> },
    { path: '/registration', element: <Registration/> },
    { path: '/*', element: <Login/> },
]