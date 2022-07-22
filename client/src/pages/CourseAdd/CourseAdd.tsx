import { Button, Form, Input, Select, Typography } from 'antd'
import { Content, Header } from 'antd/lib/layout/layout'
import { RcFile } from 'antd/lib/upload'
import { ContentState, convertToRaw } from 'draft-js'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CourseService from '../../api/CourseService'
import CustomEditor from '../../components/Editor/CustomEditor'
import ImgInput from '../../components/UI/ImgInput/ImgInput'
import { useAppDispatch } from '../../hooks/redux'
import { fetchCourses } from '../../store/reducers/course/ActionCreators'

const { Option } = Select
const { TextArea } = Input
const { Title, Text } = Typography

enum FormNames {
  TITLE = 'title', 
  DESCRIPTION = 'description',
  INTRO_VIDEO_SRC = 'introVideoSrc',
  TYPE = 'type'
}

const CourseAdd:React.FC = () => {
  const [file, setFile] = useState<string | RcFile | Blob>(null)
  const [editorContent, setEditorContent] = useState<ContentState>(null)
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  useEffect(() => {
    document.title = 'Добавить новый курс'
  }, [])

  const finishHandler = async () => {
    const fd = new FormData()
    const draftJSBody = JSON.stringify(convertToRaw(editorContent))
    const formValues = form.getFieldsValue([...Object.values(FormNames)])
    fd.append('imgCover', file)
    fd.append('draftJSBodyIntro', draftJSBody)
    for (const key in formValues) {
      fd.append(key, formValues[key])
    }
    
    try {
      await CourseService.postCourse(fd)
      dispatch(fetchCourses())
      navigate(-1)
    } catch (e) {
      console.log(e.message)
    }
    
  }

  return (
    <>
      <Header className='header'>
        <Title level={1}>Добавить новый курс</Title>
      </Header>
      <Content>
        <Form
          onFinish={finishHandler}
          form={form}
          wrapperCol={{ span: 24 }}
          layout="vertical"
        >
        <Form.Item 
          label="Название курса"
          name={FormNames.TITLE}
          rules={[{ required: true, message: 'Пожалуйста введите название курса' }]}
        >
          <Input />
        </Form.Item>
        
        <Form.Item 
          label="Краткое описание курса"
          name={FormNames.DESCRIPTION}
        >
          <TextArea rows={4} />
         </Form.Item>
        
          <Form.Item 
            label="Тип курса"
            name={FormNames.TYPE}
            initialValue="Course"
          >
            <Select style={{ width: 120 }} >
              <Option value="Course">Курс</Option>
              <Option value="Marathon">Марафон</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Обложка курса">
            <ImgInput setFile={setFile}/>
          </Form.Item>

          <Form.Item 
            label="Ссылка на вводный ролик"
            name={FormNames.INTRO_VIDEO_SRC}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Описание к вводному ролику">
            <Text>
              <CustomEditor setContentState={setEditorContent} />
            </Text>
          </Form.Item>

          <Form.Item >
            <Button  htmlType="submit">Добавить</Button>
          </Form.Item>

        </Form>
      </Content>
    </>
  )
}

export default CourseAdd