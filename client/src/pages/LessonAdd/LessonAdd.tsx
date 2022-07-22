import { Button, Form, Input, Typography } from 'antd'
import { Content, Header } from 'antd/lib/layout/layout'
import { ContentState, convertToRaw } from 'draft-js'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import LessonService from '../../api/LessonService'
import CustomEditor from '../../components/Editor/CustomEditor'

const { Title, Text } = Typography

enum FormNames {
  TITLE = 'title', 
  LESSON_NUMBER = 'lessonNumber',
  VIDEO_SRC = 'videoSrc',
}

const LessonAdd:React.FC = () => {
  const navigate = useNavigate()
  const params = useParams()
  const [form] = Form.useForm()
  const [editorContent, setEditorContent] = useState<ContentState>(null)
  const [isSending, setIsSending] = useState<boolean>(false)

  useEffect(() => {
    document.title = 'Добавить новый урок'
  }, [])

  const finishHandler = async () => {
    const draftJSBody = JSON.stringify(convertToRaw(editorContent))
    const formValues = form.getFieldsValue([...Object.values(FormNames)])
    const data = {...formValues, draftJSBody: draftJSBody}

    try {
      setIsSending(true)
      await LessonService.postLesson(data, params.courseId)
      navigate(-1)
    } catch (e) {
      console.log(e.message)
    } finally {
      setIsSending(false)
    }
  }

  return (
    <>
    <Header className='header'>
      <Title level={1}>Добавить новый урок</Title>
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
            <CustomEditor setContentState={setEditorContent} />
          </Text>
        </Form.Item>

        <Form.Item >
          <Button loading={isSending}  htmlType="submit">Добавить</Button>
        </Form.Item>

      </Form>
    </Content>
  </>
  )
}

export default LessonAdd