import { Button, Form, Input, Select, Typography } from 'antd'
import { Content, Header } from 'antd/lib/layout/layout'
import { RcFile } from 'antd/lib/upload'
import { ContentState, convertFromRaw, convertToRaw } from 'draft-js'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import CourseService from '../../api/CourseService'
import CustomEditor from '../../components/Editor/CustomEditor'
import Loader from '../../components/Loader/Loader'
import ImgInput from '../../components/UI/ImgInput/ImgInput'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
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
const CourseEdit:React.FC = () => {
  const { isLoading, courses } = useAppSelector((state) => state.courseReducer)
  const [ file, setFile ] = useState<string | RcFile | Blob>(null)
  const [ editorContent, setEditorContent ] = useState<ContentState>(null)
  const [ editorState, setEditorState ] = useState<ContentState>()
  const [ inputsImg, setInputsImg ] = useState<string>()
  const [ form ] = Form.useForm()
  const params = useParams()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

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
      setInputsImg(courseById.imgCoverSrc)
      form.setFieldsValue({
        [FormNames.TITLE]: courseById.title,
        [FormNames.DESCRIPTION]: courseById.description,
        [FormNames.INTRO_VIDEO_SRC]: courseById.introVideoSrc,
        [FormNames.TYPE]: courseById.type,
      })
      document.title = 'Редактировать ' + courseById.title
    } 
  }, [courses])

  const finishHandler = async () => {
    const fd = new FormData()
    
    const draftJSBody = JSON.stringify(convertToRaw(editorContent))
    const formValues = form.getFieldsValue([...Object.values(FormNames)])
    //add file into fd if exist
    if (file) {
      fd.append('imgCover', file)
    }

    fd.append('draftJSBodyIntro', draftJSBody)
    for (const key in formValues) {
      fd.append(key, formValues[key])
    }
    
    try {
      await CourseService.updateCourse(params.id, fd)
      dispatch(fetchCourses())
      navigate('/courses')
    } catch (e) {
      console.log(e.message)
    }
    
  }
  
  return (
    <>
      {isLoading ? <Loader/> :
      <>
        <Header className='header'>
          <Title level={1}>
            Редактировать "{form.getFieldValue(FormNames.TITLE)}"
          </Title>
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
            <Input autoComplete='no'/>
          </Form.Item>
          
          <Form.Item 
            label="Краткое описание курса"
            name={FormNames.DESCRIPTION}
          >
            <TextArea rows={4} autoComplete='no'/>
            </Form.Item>
          
            <Form.Item 
              label="Тип курса"
              name={FormNames.TYPE}
            >
              <Select style={{ width: 120 }} >
                <Option value="Course">Курс</Option>
                <Option value="Marathon">Марафон</Option>
              </Select>
            </Form.Item>

            <Form.Item label="Обложка курса">
              <ImgInput 
                imgSrcUrl={inputsImg && process.env.API_STATIC_URL + inputsImg}
                setFile={setFile}
              />
            </Form.Item>

            <Form.Item 
              label="Ссылка на вводный ролик"
              name={FormNames.INTRO_VIDEO_SRC}
            >
              <Input autoComplete='no'/>
            </Form.Item>

            <Form.Item label="Описание к вводному ролику">
              <Text>
                <CustomEditor contentState={editorState} setContentState={setEditorContent} />
              </Text>
            </Form.Item>
            
            <Form.Item >       
                <Button loading={isLoading}  htmlType="submit">Изменить</Button>
            </Form.Item>

          </Form>
        </Content>
      </>
      }
    </>
  )
}

export default CourseEdit