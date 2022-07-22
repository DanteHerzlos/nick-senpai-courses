import { Alert, Button, Divider, Space, Typography } from 'antd'
import { Content, Header } from 'antd/lib/layout/layout'
import { ContentState, convertFromRaw } from 'draft-js'
import React, { useEffect, useState} from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import CourseService from '../../api/CourseService'
import { canDeleteCourse, canEditCourse } from '../../api/RolesEnum'
import CustomEditor from '../../components/Editor/CustomEditor'
import Loader from '../../components/Loader/Loader'
import Player from '../../components/Player/Player'
import DeleteButton from '../../components/UI/DeleteButton/DeleteButton'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import { fetchCourses } from '../../store/reducers/course/ActionCreators'
import { ICourse } from '../../types/ICourse'

const { Title, Text } = Typography

const Course:React.FC = () => {
  const [successMessage, setSuccessMessage] = useState<string>('')
  const [ isSending, setIsSending ] = useState<boolean>(false)
  const [ editorState, setEditorState ] = useState<ContentState>()
  const [ course, setCourse ] = useState<ICourse>({} as ICourse)
  const { isLoading, courses } = useAppSelector((state) => state.courseReducer)
  const params = useParams()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const {user} = useAppSelector((state) => state.userReducer)
  
  useEffect( () => {
    if(courses.length === 0){
      dispatch(fetchCourses()) 
    }   
  }, [])

  useEffect(() => {
    if(courses.length !== 0){
      const courseById = courses.filter(d => d._id === params.id)[0]
      if(courseById.hasOwnProperty('draftJSBodyIntro')){    
        setEditorState(convertFromRaw(JSON.parse(courseById.draftJSBodyIntro)))
      }
      setCourse(courseById)
      document.title = courseById.title
    }
  }, [courses])

  const goToEdit = () => {
    navigate(`/courses/edit/${params.id}`)
  }

  const purchaseClick = async () => {
    const dto = {courseId: params.id, userId: user.userId}
    try {
      setIsSending(true)
      const response = await CourseService.sendMailForPayment(dto)
      setSuccessMessage(response.data)
    } catch (e) {
      setSuccessMessage(e.response.data.message)
    } finally {
      setIsSending(false)
    }
  }

  const closeAlert = () => {
    setSuccessMessage('')
  }
  
  return (
    <>
      {isLoading ? <Loader/> : 
        <>
          <Header className='header'>
            <Title level={1}>{course.title}</Title>
          </Header>
          <Content>
            <Player
              url={course.introVideoSrc}
            />
            <Divider/>
            <Title level={2} className='text-center'>Описание</Title>
            <Text>
              <CustomEditor contentState={editorState} readonly={true}/>
            </Text>
            <div>
            <Divider/>
              {successMessage &&
                <Alert 
                  closable 
                  onClose={closeAlert} 
                  message={successMessage} 
                  type="success" 
                  className='alert'
                />
              }
              <Button loading={isSending} type="primary" onClick={purchaseClick}>
                Хочу приобрести!
              </Button>
            <Divider/>
            <Space size="middle">
            {canEditCourse.includes(user.role)  &&
              <Button 
                style={{marginBottom:'1rem'}}
                onClick={goToEdit}
                type="primary">
                Редактировать
              </Button>
            }
            {canDeleteCourse.includes(user.role)  &&
              <DeleteButton
                compareText={course.title}
                id={course._id}
                type={'course'}
                modalMessage='Для подтверждения, введите название курса:'
              >
                Удалить курс
              </DeleteButton>
            } 
            </Space>
            </div>
          </Content>
        </>   
      }
    </>
  )
}

export default Course