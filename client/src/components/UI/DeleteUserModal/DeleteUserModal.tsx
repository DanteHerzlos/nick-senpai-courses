import { Divider, Input, message, Modal, Typography } from 'antd'
import React, { useState } from 'react'
import AdminService from '../../../api/AdminService'
import { IUser } from '../../../types/IUser'
const { Title, Text } = Typography

interface DeleteUserModalProps {
  isVisible: boolean
  setIsVisible: (isVisible: boolean) => void
  userData: IUser
  userList: IUser[]
  setUserList: (userList: IUser[]) => void
}


const DeleteUserModal:React.FC<DeleteUserModalProps> = ({
  userData, isVisible, setIsVisible, userList, setUserList
}) => {
  const [ compareInput, setCompareInput ] =  useState<string>('')
  const [ isLoading, setIsLoading ] = useState<boolean>(false)

  const handleDeleteOk = async () => {
    if(compareInput === userData.email) {
      try {
        setIsLoading(true)
        await AdminService.deleteUser(userData.userId)
        setIsVisible(false)
        setUserList(userList.filter(user => user.userId !== userData.userId))
        setCompareInput('')
        message.success(`Успешное удаления пользователя: ${userData.username}`)
      } catch (e) {
        message.error(e.response.data.message)
      } finally {
        setIsLoading(false)
      }
    }else {
      message.error('Email не совпадает');
    }
  }
  
  const handleDeleteCancel = () => {
    setIsVisible(false)
    setCompareInput('')
  }
  return (
    <>
    {userData &&
      <Modal
        title={`Удалить пользователя ${userData.username}?`}
        visible={isVisible} 
        onOk={handleDeleteOk}
        okButtonProps={{loading: isLoading}}
        okText='Удалить'
        onCancel={handleDeleteCancel}
        cancelText='Отмена'
      >
        <Title level={4}>Email: {userData.email}</Title>
        <Divider/>
        <Text>Для подтверждения, введите email пользователя:</Text>
        <Input
          value={compareInput}
          onChange={(e) => setCompareInput(e.currentTarget.value)}
          onPressEnter={handleDeleteOk}
        />
      </Modal>
    }
    </>
  )
}

export default DeleteUserModal