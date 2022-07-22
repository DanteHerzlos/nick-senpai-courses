import { Card, Col, Row, Typography } from 'antd'
import Meta from 'antd/lib/card/Meta'
import { Content, Header } from 'antd/lib/layout/layout'
import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAppSelector } from '../../hooks/redux'

const {Title} = Typography


const MyCourses: React.FC = () => {
  const {user} = useAppSelector((state) => state.userReducer)
  useEffect(() => {
    document.title = 'Мои курсы'
  }, [])
  return (
    <>
      <Header className='header'><Title>Список моих курсов</Title></Header>
      <Content>
        {user.purchasedCourses.length === 0 ?
        <>
        <Title level={3}>Пока нет приобретненных курсов...</Title>
        <Link to='/courses'>К списку курсов</Link>
        </> :
        <Row gutter={[24, 24]} justify="center">
          {user.purchasedCourses.map(course => 
            <Col key={course._id} sm={24} md={8}>
              <Link to={`/user_courses/${course._id}/lessons`}>
                <Card 
                  hoverable
                  cover={
                    <img 
                      alt="example" 
                      src={process.env.API_STATIC_URL + course.imgCoverSrc} 
                    />
                  }
                >
                  <Meta title={course.title} description={course.description}/>
                </Card>
              </Link>
            </Col>
          )}
        </Row>
        }
      </Content>
    </>
  )
}

export default MyCourses