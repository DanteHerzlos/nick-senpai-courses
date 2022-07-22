import { Typography } from 'antd'
import { Content, Header } from 'antd/lib/layout/layout'
import React, { useEffect } from 'react'

const {Title, Text } = Typography

const About: React.FC = () => {
  useEffect(() => {
    document.title = 'О сайте'
  }, [])

  return (
    <>
    <Header className='header'>
      <Title>О сайте</Title>
    </Header>
    <Content> 
      <Text>
        Тут описание сайта
      </Text>
    </Content>
  </>
  )
}

export default About