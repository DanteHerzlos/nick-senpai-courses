import { Layout } from 'antd'
import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { useAppSelector } from '../../hooks/redux'
import Admin from '../../pages/Admin/Admin'
import { adminMenu, privateRoutes, privateSidebar, publicRoutes, publicSidebar } from '../../routes'
import Sidebar from '../UI/Sidebar/Sidebar'


const AppRouter: React.FC = () => {
  const {isAuth, user} = useAppSelector((state) => state.userReducer)
    
  return (
    <Router> 
      <Layout hasSider >
        {isAuth ? 
        <>
        <Sidebar items={
          user.role === 'admin' ? 
          [...privateSidebar, adminMenu] : 
          privateSidebar
        }/>
        <Layout>
          <Routes>
            {privateRoutes.map(route => 
              <Route key={route.path} path={route.path} element={route.element} />    
            )}
            {user.role === 'admin' && <Route path={'/admin'} element={<Admin/>} />}        
          </Routes>
        </Layout>
        </>
        :
        <>
        <Sidebar items={publicSidebar}/>
        <Layout>
          <Routes>
            {publicRoutes.map(route => 
              <Route key={route.path} path={route.path} element={route.element} />    
            )}            
          </Routes>
        </Layout> 
        </>
        }
      </Layout>
    </Router>

  )
}

export default AppRouter