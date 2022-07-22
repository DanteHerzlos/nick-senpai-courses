import { Button, Divider, Space, Typography } from 'antd'
import { Content, Header } from 'antd/lib/layout/layout'
import { ContentState, convertFromRaw } from 'draft-js'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ProgressService from '../../api/ProgressService'
import { canDeleteLesson, canEditLesson } from '../../api/RolesEnum'
import CustomEditor from '../../components/Editor/CustomEditor'
import Loader from '../../components/Loader/Loader'
import Player from '../../components/Player/Player'
import ArrowButtons from '../../components/UI/ArrowButtons/ArrowButtons'
import DeleteButton from '../../components/UI/DeleteButton/DeleteButton'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import { fetchLessonsByCourseId } from '../../store/reducers/lesson/ActionCreators'
import { ILesson } from '../../types/ILesson'

const { Text, Title } = Typography

interface IProgress {
  played: number
}

const Lesson:React.FC = () => {
  const [ lesson, setLesson ] = useState<ILesson>({} as ILesson)
  const [ editorState, setEditorState ] = useState<ContentState>()
  const { isLoading, lessons, error } = useAppSelector(
    (state) => state.lessonReducer
  )
  const [ progress, setProgress ] = useState<number>(0)
  const [ lessonIndex, setLessonIndex] = useState<number>()
  const {user} = useAppSelector((state) => state.userReducer)
  const navigate = useNavigate()
  const params = useParams()
  const dispatch = useAppDispatch()

  useEffect( () => {
    lessons.length === 0 && dispatch(fetchLessonsByCourseId(params.courseId))  
  }, [])

  const setProps = (lessonId: string) => {
    const lessonById = lessons.filter(lesson => lesson._id === lessonId)[0]
    setLessonIndex(lessons.findIndex(l => { return l._id === lessonById._id}))
    if(lessonById.hasOwnProperty('draftJSBody')){    
      setEditorState(convertFromRaw(JSON.parse(lessonById.draftJSBody)))
    }else{
      setEditorState(null)
    }
    console.log(lessonById);
    
    setLesson(lessonById)
    document.title = lessonById.title
  }

  useEffect(() => {
    if(lessons.length !== 0){
      setProps(params.lessonId)
    }
  }, [lessons])

  const goToEdit = () => {
    navigate(`/user_courses/${params.courseId}/lessons/${params.lessonId}/edit`)
  }

  const handlePause = () => {
    const dto = {
      lessonId: lesson._id,
      userId: user.userId,
      progress
    }
    ProgressService.changeProgress(dto)
  }

  const handleEnded = () => {
    const dto = {
      lessonId: lesson._id,
      userId: user.userId,
      progress: 1
    }
    ProgressService.changeProgress(dto)
  }

  if (error){ return <Title>{error}</Title> }
  
  return (  
    <>{isLoading ? <Loader/> :
    <>
    <Header className='header'>
      <Title>{lesson.title}</Title>
    </Header>
    <Content>
      <ArrowButtons lessonIndex={lessonIndex} setProps={setProps}/>
      {lesson.videoSrc && 
      <>
      <Divider />
      <div >
        <Player
          onEnded={handleEnded}
          onPause={handlePause}
          onProgress={(event: IProgress) => setProgress(event.played)}
          url={lesson.videoSrc}
        />
      </div>
      </>
      }
      <Divider />
      <Title level={2} className='text-center'>Описание</Title>
      <Text>
        <CustomEditor contentState={editorState} readonly={true}/>
      </Text>
      {/* <Divider />
      <h2 className='mb-3 mt-5 text-center'>Комментарии</h2> */}
      <div>
        <Divider/>
        <Space size="middle">
        {canEditLesson.includes(user.role)  &&
          <Button 
            style={{marginBottom:'1rem'}}
            onClick={goToEdit}
            type="primary">
            Редактировать
          </Button>
        }
        {canDeleteLesson.includes(user.role)  &&
          <DeleteButton 
            id={lesson._id}
            compareText={lesson.title}
            type={'lesson'}
            modalMessage='Для подтверждения, введите название урока:'
          >
            Удалить урок
          </DeleteButton>
        } 
        </Space>
      </div>
      </Content>
    </>}
    </>
  )
}

export default Lesson