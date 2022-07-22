// import React from 'react'
// import { Dropdown, Menu, Space } from "antd"
// import { MenuInfo } from 'rc-menu/lib/interface'
// import { useAppDispatch } from '../../../hooks/redux'
// import { logout } from '../../../store/reducers/user/ActionCreators'
// import { Link } from 'react-router-dom'

// const ProfileDropDown:React.FC = () => {
//   const dispatch = useAppDispatch()

//   const clickHandler = (item: MenuInfo) => {
//     if(item.key === '9'){
//       dispatch(logout())
//     }
//   }

//   const menu = (
//     <Menu
//       onClick={(item) => clickHandler(item)}
//       items={[
//         {
//           label: <Link to='/user_profile'>Личный Кабинет</Link>,
//           key: '0',
//         },
//         {
//           label: "Выход",
//           key: '9',
//         }
//       ]}
//     />
//   )

//   return (
//     <Dropdown overlay={menu} trigger={['click']}>
//       <Space>
//         Профиль
//       </Space>
//     </Dropdown>
//   )
// }

// export default ProfileDropDown