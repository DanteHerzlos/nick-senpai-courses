import { Button, message, Input} from 'antd'
import Table, { ColumnsType, TablePaginationConfig } from 'antd/lib/table'
import React, { useEffect, useState } from 'react'
import AdminService from '../../api/AdminService'
import { useAppSelector } from '../../hooks/redux'
import { ICourse } from '../../types/ICourse'
import { IUser } from '../../types/IUser'
import DeleteUserModal from '../UI/DeleteUserModal/DeleteUserModal'
import UserEditModal from '../UI/UserEditModal/UserEditModal'
import './UserTable.sass'

const { Search } = Input

interface DataType {
  key: string
  username: string
  email: string
  role: string
}

const UserTable:React.FC = () => {
  const [ isModalVisible, setIsModalVisible ] = useState<boolean>(false)
  const [ isDeleteModalVisible, setIsDeleteModalVisible] = useState<boolean>(false)
  const [ userList, setUserList ] = useState<IUser[]>([] as IUser[])
  const [ tableData, setTableData ] = useState<DataType[]>()
  const [ courseList, setCourseList] = useState<ICourse[]>()
  const { user } = useAppSelector((state) => state.userReducer)
  const [ userData, setUserData ] = useState<IUser>()
  const [ isFetching, setIsFetching ] = useState<boolean>(false)
  const [ paginOptions, setPaginOptions ] = useState<TablePaginationConfig>({})
  const [ searchValue, setSearchValue ] = useState<string>('')
  const columns: ColumnsType<DataType> = [
    {
      title: 'Имя пользователя',
      dataIndex: 'username',
      render: username => username
    },
    {
      title: 'email',
      dataIndex: 'email',
      render: email => email
    },
    {
      title: 'Роль',
      dataIndex: 'role',
      render: role => role
    },
    {
      title: 'Удалить',
      dataIndex: 'key',
      render: key => 
      <>
      {user.userId !== key ?  
        <Button 
          danger
          onClick={(e) => {e.stopPropagation(); deleteHandler(key)}}
        >
          Удалить 
        </Button>: ''}
      </>
    },
  ]

  useEffect(() => {
    setTableData(
      userList.map(user =>  ({
        key: user.userId,
        username: user.username,
        email: user.email,
        role: user.role,
    })))
  }, [userList])

  const fetchUsers = async(
    limit: number, 
    page: number, 
    emailSearch?: string
  ) => {
    try {
      setIsFetching(true)
      const users = await AdminService.getAllUsers(limit, page, emailSearch)
      setUserList(users.data.users)
      setPaginOptions({
        total: users.data.totalCount,
        pageSize: limit,
        current: page,
        showSizeChanger: true, 
        pageSizeOptions: [ 10, 20, 50, 100 ]
      })
    } catch (e) {
      message.error(e.response.data.message)
    } finally {
      setIsFetching(false)
    }
  }

  const fetchCourses = async() => {
    const courses = await AdminService.getAllСoursesName()
    setCourseList(courses.data)
  }

  useEffect(() => {
    fetchUsers(10, 1, searchValue)
    fetchCourses()
  }, [])

  const rowClickHandler = ( userId: string) => {
    const user = userList.filter(u => u.userId === userId)[0]
    setUserData(user)
    setIsModalVisible(true)
  }

  const deleteHandler = (userId: string) => {
    const user = userList.filter(u => u.userId === userId)[0]
    setUserData(user)
    setIsDeleteModalVisible(true)
  }

  const handleTableChange = (e:TablePaginationConfig) => {
    fetchUsers(e.pageSize, e.current, searchValue)
  }

  const handleSearch = (value: string) => {
    setSearchValue(value)
    fetchUsers(paginOptions.pageSize, 1, value)
  }

  return (
  <>
    <Search 
      placeholder="Поиск по email"
      enterButton="Поиск"
      loading={isFetching}
      onSearch={value => handleSearch(value)}
    />
    <br/><br/>
    <Table 
      loading={isFetching}
      pagination={paginOptions} 
      onChange={e => handleTableChange(e)}
      columns={columns} 
      dataSource={tableData}
      rowClassName='tableRow'
      onRow={(record) => {
        return { onClick: () => {rowClickHandler(record.key)}, }
      }}     
    />
    <UserEditModal
      setIsVisible={setIsModalVisible}
      isVisible={isModalVisible}
      courseList={courseList}
      userData={userData}
      userList={userList}
      setUserList={setUserList}
    />
    <DeleteUserModal
      isVisible={isDeleteModalVisible}
      setIsVisible={setIsDeleteModalVisible}
      userData={userData}
      userList={userList}
      setUserList={setUserList}
    />
  </>
  )
}

export default UserTable