import { Typography } from 'antd'
import { Content, Header } from 'antd/lib/layout/layout'
import React, { useEffect } from 'react'
import UserTable from '../../components/UserTable/UserTable'

const { Title } = Typography

const Admin:React.FC = () => {
  useEffect(() => {
    document.title = 'Админ'
  }, [])

  return (
    <>
    <Header className='header'>
      <Title level={1}>Админка</Title>
    </Header>
    <Content>
      <Title level={3}>Список пользователей:</Title>
      <UserTable />
    </Content>
    </>
  )
}

export default Admin