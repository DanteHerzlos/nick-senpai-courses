import { Button, message, Modal } from 'antd'
import Input from 'antd/lib/input/Input'
import React, { ReactNode, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CourseService from '../../../api/CourseService'
import LessonService from '../../../api/LessonService'

interface DeleteButtonProps {
  type: 'course' | 'lesson'
  compareText: string
  id: string
  modalMessage: string
  children: ReactNode
}

const DeleteButton:React.FC<DeleteButtonProps> = ({
  type, modalMessage, children, compareText, id
}) => {
  const [ compareInput, setCompareInput ] = useState<string>('')
  const [ isModalVisible, setIsModalVisible ] = useState<boolean>(false)
  const [ isLoading, setIsLoading ] = useState<boolean>(false)
  const navigate = useNavigate()

  const handleOk = async () => {
    if ( compareInput === compareText ){
      try {
        setIsLoading(true)
        switch (type) {
          case 'course':
            await CourseService.removeCourse(id)
            break
          case 'lesson':
            await LessonService.removeLesson(id)
            break
          default:
            break
        }
        navigate(-1)
      } catch (e) {
        message.error(e.reasponse.data.message)
      } finally {
        setIsLoading(false)
      }
    }else{
      message.error('Название не совпадает!');
    }
  }

  const handleCancel = () => {
    setCompareInput('')
    setIsModalVisible(false)
  }

  return (
  <>
    <Button 
      style={{marginBottom:'1rem'}}
      onClick={() => setIsModalVisible(true)} 
      type="primary" 
      danger
    >
      {children}
    </Button>
    <Modal 
      title={'Удалить "' + compareText + '"?'} 
      visible={isModalVisible} 
      okButtonProps={{loading: isLoading}}
      onOk={handleOk} 
      onCancel={handleCancel}
    >
      <p>{modalMessage}</p>
      <Input
        value={compareInput}
        onChange={(e) => setCompareInput(e.currentTarget.value)}
        onPressEnter={handleOk}
      />
    </Modal>
  </>
  )
}

export default DeleteButton