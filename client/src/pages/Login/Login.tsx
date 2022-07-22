import { LockOutlined, MailOutlined } from '@ant-design/icons'
import { Button, Form, Typography, Input, Alert } from 'antd'
import { Content, Header } from 'antd/lib/layout/layout'
import React, { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import { authorization } from '../../store/reducers/user/ActionCreators'
import './Login.sass'

const { Title } = Typography
const Login:React.FC = () => {
  const [alertMessage, setAlertMessage] =  useState<string>('')
  const [successMessage, setSuccessMessage] = useState<string>('')
  const [searchParams] = useSearchParams();
  const [form] = Form.useForm()
  const dispatch = useAppDispatch()
  const {error, isLoading} = useAppSelector((state) => state.userReducer)

  const finishHandler = async () => { 
    const loginData = form.getFieldsValue(['email', 'password'])
    await dispatch(authorization(loginData))
  }

  useEffect(() => {
    document.title = 'Логин'
    if(error){
      setAlertMessage(error)     
    }
    if(searchParams.get("success")){
      setSuccessMessage('Успешная регистрация')
    }
  }, [isLoading])

  const closeAlert = () => {
    setAlertMessage('')
  }

  return (
    <>
    <Header className='header'>
      <Title>Вход</Title>
    </Header>
    <Content> 
      <div className='login-form-container'>
        <Form
          onFinish={finishHandler}
          form={form}
          name="normal_login"
          className="login-form"
          initialValues={{ remember: true }}
        >
          {successMessage &&
            <Form.Item>
              <Alert 
                closable 
                onClose={closeAlert} 
                message={successMessage} 
                type="success" 
                className='alert'
              />
            </Form.Item>
          }
          {alertMessage &&
            <Form.Item>
              <Alert 
                closable 
                onClose={closeAlert} 
                message={alertMessage} 
                type="error" 
                className='alert'
              />
            </Form.Item>
          }
          {/* временный блок */}
          <Form.Item>
              <Alert 
              description={<>
              <span>email: admin@email.com</span>
              <br/>
              <span>password: admin1234</span>
              </>}
                type="info"
                className='alert'
              />
            </Form.Item>
          {/* временный блок */}

          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Пожалуйста введите имя электронной почты!' }]}
          >
            <Input 
              autoComplete='on' 
              prefix={<MailOutlined className="site-form-item-icon" />} 
              placeholder="Email" 
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Пожалуйста введите пароль!' }]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              autoComplete="on"
              type="password"
              placeholder="Пароль"
            />
          </Form.Item>
          <Form.Item>
            <Link className="login-form-forgot" to="/reset_password">
              Забыли пароль?
            </Link>
          </Form.Item>

          <Form.Item>
            <Button loading={isLoading} type="primary" htmlType="submit" className="login-form-button">
              Вход
            </Button>
            или <Link to="/registration">зарегистрироваться!</Link>
          </Form.Item>
        </Form>
      </div>
    </Content>
  </>
  )
}

export default Login