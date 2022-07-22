import { Progress, Table } from 'antd'
import type { ColumnsType } from 'antd/lib/table';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import ProgressService from '../../api/ProgressService';
import { CoursesProgressDto } from '../../dto/CoursesProgressDto';
import { useAppSelector } from '../../hooks/redux';
import './CoursesTable.sass'

interface DataType {
  key: string
  title: string
  progress: number
}

const columns: ColumnsType<DataType> = [
  {
    title: 'Название',
    dataIndex: 'title',
    render: (text, record) => <Link 
      to={{pathname: '/user_courses/' + record.key + '/lessons'}}
    >
      {text}
    </Link>,
  },
  {
    title: 'Прогресс',
    dataIndex: 'progress',
    render: percent => <Progress percent={percent}></Progress>,

  }
]

const CoursesTable:React.FC = () => {
  const { user } = useAppSelector((state) => state.userReducer)
  const [ courseList, setCourseList ] = useState<CoursesProgressDto[]>([])

  const fetchProgresses = async () => {
    const {data} = await ProgressService.getCoursesProgress(user.userId)
    setCourseList(data)
  }
 
  useEffect(() => {
    fetchProgresses()
  }, [])

  const data: DataType[] = courseList.map(course =>  ({
    key: course._id,
    title: course.title,
    progress: Math.round(course.progress*100)
  }))
  

  
  return (
    <Table 
      pagination={false} 
      columns={columns} 
      dataSource={data} 
    />
  )
}

export default CoursesTable