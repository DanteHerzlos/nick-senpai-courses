import { Progress } from 'antd'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import './LessonButton.sass'


interface LessonButtonProps {
  title: string
  progress: number
  url: string
  className?: string
}

const LessonButton:React.FC<LessonButtonProps> = ({title, progress, url, className}) => {
  const navigate = useNavigate()
  const clickHandler = () => {
    navigate(`${url}`)
  }
  
  return (
    <div className={className}>
      <div className='lesson' onClick={clickHandler}>
        <span  className='lesson-title'>{title}</span>
        <div className='progressContaniner'>
          <Progress 
            showInfo={false}
            strokeWidth={20} 
            width={30} 
            type="circle" 
            percent={progress} 
          />
        </div>
      </div> 
    </div> 
  )
}

export default LessonButton