import { Divider, message, Modal, Select, Typography } from 'antd'
import React, { useEffect, useState } from 'react'
import AdminService from '../../../api/AdminService'
import { Role } from '../../../api/RolesEnum'
import { useAppSelector } from '../../../hooks/redux'
import { ICourse } from '../../../types/ICourse'
import { IUser } from '../../../types/IUser'
import CheckboxCoursesGroup from '../CheckboxCoursesGroup/CheckboxCoursesGroup'

const { Title, Text } = Typography
const roleList = Object.values(Role)

interface UserEditModalProps {
  userData: IUser
  courseList: ICourse[]
  userList: IUser[]
  setUserList: (userList: IUser[]) => void
  isVisible: boolean
  setIsVisible: (isVisible: boolean) => void
}
const UserEditModal:React.FC<UserEditModalProps> = ({
  userData, userList, courseList, setUserList, isVisible, setIsVisible
}) => {
  const [ checkboxOptions, setCheckboxOptions ] = useState([])
  const [ isLoading, setIsLoading ] = useState<boolean>(false)
  const [ userInfo, setUserInfo ] = useState<IUser>({} as IUser)
  const [ buttonDisable, setButtonDisable ] = useState<boolean>(true)
  const [ courses, setCourses ] = useState([])
  const [ userRole, setUserRole ] = useState<string>()
  const { user } = useAppSelector((state) => state.userReducer)

  useEffect(() => {
    if(courseList){
      setCheckboxOptions(courseList.map(
        course => { return {label: course.title, value: course._id}}
      ))
    }
    if(userData){
      setUserRole(userData.role)
      setCourses(userData.purchasedCourses.map(c => c._id))
      setUserInfo(userData)
      setButtonDisable(true)
    }

  }, [isVisible])

  const resetForm = () => {
    setCourses([])
    setUserRole('')
    setButtonDisable(true)
  }

  const handleCancel = () => {
    resetForm()
    setIsVisible(false)
  }

  const handleOk = async () => {
    const data = {courses: courses, role: userRole}
    try {
      setIsLoading(true)
      await AdminService.updateUserInfo(userInfo.userId, data)
      setIsVisible(false)
      const newList = userList.map(user => {
        if(user.userId === userInfo.userId){
          user.role = data.role
          user.purchasedCourses = courseList.filter(
            c => data.courses.includes(c._id)
          )
        }       
        return user
      })

      setUserList(newList)
      message.success('Успешное изменение!')
    } catch (e) {
      message.error(e.response.data.message)
    } finally {
      setIsLoading(false)
    }
    resetForm()
    setIsVisible(false)
  }

  const changeSelectHandler = (selectValue: string) => {
    setButtonDisable(false)
    setUserRole(selectValue)   
  }

  return (
    <Modal
      title={'Пользователь: ' + userInfo.username}
      visible={isVisible} 
      onOk={handleOk}
      okText='Подтвердить'
      onCancel={handleCancel}
      cancelText='Отмена'
      cancelButtonProps={{danger: true, type: 'primary'}}
      okButtonProps={{disabled: buttonDisable, loading: isLoading}}
    >
      <Title level={4}>Email: {userInfo.email}</Title>
      <Divider/>

      <Text strong={true}>Роль: </Text>
      <Select
        disabled={user.userId === userInfo.userId}
        onChange={changeSelectHandler} 
        value={userRole} 
        style={{ width: 120 }}
      >
        {roleList.map((role, index)=> { return (            
          <Select.Option key={index.toString()} value={role}>
            {role}
          </Select.Option>
        )})}
      </Select>
      <Divider/>

      <Text strong={true}>Список курсов:</Text>
      <br/>
      <br/>
      <CheckboxCoursesGroup
        checkboxOptions={checkboxOptions}
        courses={courses}
        setCourses={setCourses}
        setButtonDisable={setButtonDisable}
      />
    </Modal>
  )
}

export default UserEditModal