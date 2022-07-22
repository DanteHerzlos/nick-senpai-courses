import { Button, Divider, Typography } from 'antd'
import { Content, Header } from 'antd/lib/layout/layout'
import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import {  useLocation } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import { canAddLesson } from '../../api/RolesEnum'
import Loader from '../../components/Loader/Loader'
import LessonButton from '../../components/UI/LessonButton/LessonButton'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import { fetchLessonsByCourseId } from '../../store/reducers/lesson/ActionCreators'
import './LessonsList.sass'

const {Title} = Typography

const LessonsList:React.FC = () =>{ 
  const location = useLocation()
  const params = useParams()
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.userReducer)
  const { 
    isLoading, 
    lessons, 
    error 
  } = useAppSelector((state) => state.lessonReducer)
  
  useEffect(() => {
      dispatch(fetchLessonsByCourseId(params.courseId))   
  }, [])

  useEffect(() => {
    if(!lessons[0]){
      document.title = 'Уроков к этому курсу пока нет...'
    } else {
      document.title = lessons[0].courseId.title
    }
  }, [lessons])

  if (error){ 
    useEffect(() => {
      document.title = error
    }, [])
    return (
      <Title>{error}</Title>
    )
  }
 
  return (
    <>
      <Header className='header'>
        {lessons[0] && <Title>{lessons[0].courseId.title}</Title>}
      </Header>

      {isLoading ? <Loader/> : 
        <Content>
          {!lessons[0] && <Title>Уроков к этому курсу пока нет...</Title>}
          {lessons.map(lesson => 
            <LessonButton
              key={lesson._id}
              className='lesson-btn'
              url={lesson._id}
              title={`Lesson ${lesson.lessonNumber}: ${lesson.title}`}
              progress={
                lesson.progresses[0] ? 
                lesson.progresses[0].progress*100 : 0
              }
            />
          )}
          <Divider/>
          {canAddLesson.includes(user.role)  &&
            <Button 
              style={{marginBottom:'1rem'}}
              type="primary">
              <Link to={location.pathname + '/new'}>Добавить урок</Link>
            </Button>
          } 
        </Content>
      }
    </>
  )
}

export default LessonsList