import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAppSelector } from '../../../hooks/redux'
import './ArrowButtons.sass'

interface ArrowButtonsProps {
  lessonIndex: number
  setProps: (lesson: string) => void
}

const ArrowButtons:React.FC<ArrowButtonsProps> = ({lessonIndex, setProps}) => {
  const [ prevLesson, setPrevLesson ] = useState<string>('')
  const [ nextLesson, setNextLesson ] = useState<string>('')
  const { lessons } = useAppSelector((state) => state.lessonReducer)
  const params = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    if(lessonIndex > 0) {
      setPrevLesson(lessons[lessonIndex-1]._id)
    } else {
      setPrevLesson('')
    }
    if(lessonIndex  < lessons.length - 1) {
      setNextLesson(lessons[lessonIndex+1]._id)
    } else {
      setNextLesson('')
    }
  }, [lessonIndex])

  const nextLessonClick = () => {
    navigate(`/user_courses/${params.courseId}/lessons/${nextLesson}`)
    setProps(nextLesson)
  }
  
  const prevLessonClick = () => {
    navigate(`/user_courses/${params.courseId}/lessons/${prevLesson}`)
    setProps(prevLesson)
  }
  return (
    <div className='arrow-btns'>
      {prevLesson && 
      <Button
        className='arrow-btn'
        onClick={prevLessonClick}
        shape='round'
        size='small'
      >
        <Link to={`/user_courses/${params.courseId}/lessons/${prevLesson}`}>
          <LeftOutlined />
          {'Предыдущий\u00A0урок'}
        </Link>
      </Button>
      }
      {nextLesson &&
      <Button 
        className='arrow-btn arrow-r-btn'
        onClick={nextLessonClick}
        shape='round' 
        size='small'
      >
        <Link to={`/user_courses/${params.courseId}/lessons/${nextLesson}`}>
          {'Следующий\u00A0урок'}
          <RightOutlined />
        </Link>
      </Button>
      }
    </div>
  )
}

export default ArrowButtons