import { PlusOutlined } from '@ant-design/icons'
import { Card, Col, Row } from 'antd'
import Meta from 'antd/lib/card/Meta'
import { Content, Header } from 'antd/lib/layout/layout'
import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { canAddNewCourses } from '../../api/RolesEnum'
import Loader from '../../components/Loader/Loader'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import { fetchCourses } from '../../store/reducers/course/ActionCreators'

export enum CourseTypes {
  COURSE = 'Course',
  MARATHON = 'Marathon'
}

interface CoursesProps {
  type: CourseTypes
}
const Courses: React.FC<CoursesProps> = ({type}) => {

  const dispatch = useAppDispatch()
  const { isLoading, courses } = useAppSelector((state) => state.courseReducer)
  const { user } = useAppSelector((state) => state.userReducer)
  
  useEffect(() => {
    type === CourseTypes.COURSE ? 
      document.title = `Все курсы` : 
      document.title = `Все марафоны`
  },[type])

  useEffect(() => {
    if(courses.length === 0){
      dispatch(fetchCourses())
    }
  }, [])
  
  return (
    <>
      <Header className='header'/>
      <Content>

        <Row gutter={[24, 24]} justify="center">
        {isLoading  ? <Loader /> :
          courses
          .filter(course => course.type === type)
          .map(d => 
            <Col key={d._id} sm={24} md={8}>
              <Link to={`/courses/${d._id}`}>
                <Card 
                  hoverable
                  cover={<img alt={d.title} src={process.env.API_STATIC_URL + d.imgCoverSrc}/>}
                >
                  <Meta title={d.title} description={d.description}/>
                </Card>
              </Link>
            </Col>
          )
          }
          {canAddNewCourses.includes(user.role)  &&
          <Col sm={24} md={8}>
            <Link to='/courses/new'>
              <Card
                  hoverable
                  cover={<PlusOutlined style={{fontSize: '10rem', color: 'lightgray'}}/>}
                >
                  <Meta title="Add new Course" />
              </Card> 
            </Link>
          </Col>
          }
        </Row>
      </Content>
    </>
  )
}

export default Courses