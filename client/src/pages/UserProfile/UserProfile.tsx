import { Divider, Typography } from 'antd'
import { Content, Header } from 'antd/lib/layout/layout'
import React, { useEffect } from 'react'
import ChangePasswordForm from '../../components/ChangePasswordForm/ChangePasswordForm'
import CoursesTable from '../../components/CoursesTable/CoursesTable'
import { useAppSelector } from '../../hooks/redux'

const { Title } = Typography

const UserProfile:React.FC = () => {
  const { user } = useAppSelector((state) => state.userReducer)

  useEffect(() => {
    document.title = 'Личный кабинет'
  }, [])

  return (
    <>
      <Header className='header'><Title level={1}>Личный кабинет</Title></Header>
      <Content>
        <Title level={2}>Name: {user.username}</Title>
        <Title level={3}>Email: {user.email}</Title>
        <Divider/>
        <Title level={3}>Сменить пароль:</Title>
        <ChangePasswordForm/>
        <Divider/>
        <Title level={3} >Мои курсы:</Title>
        <CoursesTable/>
      </Content>
    </>
  )
}

export default UserProfile