import { Button, Form, Input, Typography } from 'antd'
import { Content, Header } from 'antd/lib/layout/layout'
import { ContentState, convertFromRaw, convertToRaw } from 'draft-js'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import LessonService from '../../api/LessonService'
import CustomEditor from '../../components/Editor/CustomEditor'
import Loader from '../../components/Loader/Loader'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import { fetchLessonsByCourseId } from '../../store/reducers/lesson/ActionCreators'
const { Title, Text } = Typography

enum FormNames {
  TITLE = 'title', 
  LESSON_NUMBER = 'lessonNumber',
  VIDEO_SRC = 'videoSrc',
}

const LessonEdit:React.FC = () => {
  const navigate = useNavigate()
  const params = useParams()
  const dispatch = useAppDispatch()
  const [form] = Form.useForm()
  const [editorContent, setEditorContent] = useState<ContentState>(null)
  const [ editorState, setEditorState ] = useState<ContentState>()
  const [ isSending, setIsSending ] = useState<boolean>(false)
  const { isLoading, lessons } = useAppSelector((state) => state.lessonReducer)

  useEffect( () => {
    if(lessons.length === 0){
      dispatch(fetchLessonsByCourseId(params.courseId)) 
    }   
  }, [])

  useEffect(() => {
    if(lessons.length !== 0){
      const lesson = lessons.filter(l => l._id === params.lessonId)[0] 
      if(lesson.hasOwnProperty('draftJSBody')){
        setEditorState(convertFromRaw(JSON.parse(lesson.draftJSBody)))    
      }
      form.setFieldsValue({
        [FormNames.TITLE]: lesson.title,
        [FormNames.LESSON_NUMBER]: lesson.lessonNumber,
        [FormNames.VIDEO_SRC]: lesson.videoSrc,
      })
      document.title = 'Редактировать ' + lesson.title
    } 
  }, [lessons])

  const finishHandler = async () => {
    const draftJSBody = JSON.stringify(convertToRaw(editorContent))
    const formValues = form.getFieldsValue([...Object.values(FormNames)])
    const data = {...formValues, draftJSBody: draftJSBody}
    
    try {
      setIsSending(true)
      await LessonService.updateLesson(data, params.courseId, params.lessonId)
      navigate(`/user_courses/${params.courseId}/lessons`)
    } catch (e) {
      console.log(e.message)
    } finally {
      setIsSending(false)
    }
  }

  return (
    <>
    {isLoading ? <Loader/> :
    <>
    <Header className='header'>
      <Title level={1}>Редактирование урока "{form.getFieldValue(FormNames.TITLE)}"</Title>
    </Header>
    <Content>
      <Form
        onFinish={finishHandler}
        form={form}
        wrapperCol={{ span: 24 }}
        layout="vertical"
      >
        <Form.Item 
          label="Название урока"
          name={FormNames.TITLE}
          rules={[{ required: true, message: 'Пожалуйста введите название урока' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item 
          label="Номер урока"
          name={FormNames.LESSON_NUMBER}
          rules={[{ required: true, message: 'Пожалуйста введите номер урока' }]}
        >
          <Input />
        </Form.Item>
  
        <Form.Item 
          label="Ссылка на ролик урока"
          name={FormNames.VIDEO_SRC}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Описание к уроку">
          <Text>
            <CustomEditor contentState={editorState} setContentState={setEditorContent} />
          </Text>
        </Form.Item>

        <Form.Item >
          <Button loading={isSending}  htmlType="submit">Изменить</Button>
        </Form.Item>

      </Form>
    </Content>
  </>
  }
  </>
  )
}

export default LessonEdit