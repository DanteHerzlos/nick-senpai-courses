import {  Menu } from 'antd'
import Sider from 'antd/lib/layout/Sider'
import React, { useState } from 'react'
import { MenuProps } from 'rc-menu'
import './Sidebar.sass'
import { MenuInfo } from 'rc-menu/lib/interface'
import { useAppDispatch } from '../../../hooks/redux'
import { logout } from '../../../store/reducers/user/ActionCreators'


type MenuItem = Required<MenuProps>['items'][number]
interface SidebarProps {
  items?:  MenuItem[]
}


const Sidebar: React.FC<SidebarProps> = ({items}) => {
  const [collapsed, setCollapsed] = useState(false)
  const [collapsedWidth, setCollapsedWidth] = useState<string>('80')
  const dispatch = useAppDispatch()

  
  const onBreakpointHandler = (broken:boolean) => {
    if(broken){
      setCollapsedWidth('0')
    } else {
      setCollapsedWidth('80')
    }
  }


  const clickHandler = (item: MenuInfo) => {
    if(item.key === '9'){
      dispatch(logout())
    }
  }


  return (
    <Sider 
      className='sidebar-shadow'
      onBreakpoint={(broken) => onBreakpointHandler(broken)} 
      breakpoint='xs'
      theme="light" 
      collapsible 
      onCollapse={value => setCollapsed(value)} 
      collapsedWidth={collapsedWidth}
    >
      <Menu 
        onClick={e => clickHandler(e)}
        inlineCollapsed={collapsed}
        defaultSelectedKeys={['1']}
        mode="inline" 
        items={items} 
      />     
        
    </Sider>

  )
}

export default Sidebar