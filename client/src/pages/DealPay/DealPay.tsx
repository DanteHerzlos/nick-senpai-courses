import { Typography } from 'antd'
import { Content, Header } from 'antd/lib/layout/layout'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import CourseService from '../../api/CourseService'
import Loader from '../../components/Loader/Loader'
import { useAppSelector } from '../../hooks/redux'

const {Title, Text } = Typography

const DealPay:React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const params = useParams()
  const {user} = useAppSelector((state) => state.userReducer)

  const purchase = async () => {
    const dto = {courseId: params.courseId, userId: user.userId}
    try {
      setIsLoading(true)
      await CourseService.purchaseCourse(dto)   
    } catch (e) {
      console.log(e );
      
      setErrorMessage(e.response.data.message)
    } finally {
      setIsLoading(false)
    }

  }

  useEffect(() => {
    document.title = 'Оплата курса'
    purchase()
  }, [])

  return (
    <>
      <Header className='header'>
        <Title>Покупка курса</Title>
      </Header>
      { isLoading ? <Loader/> :
      <Content> 
        <Text>
          {errorMessage ? errorMessage : "Спасибо за покупку!"}
        </Text>
      </Content>
      } 
    </>
  )
}

export default DealPay