import { Alert, Button, Form, Input, Typography } from 'antd';
import { Content, Header } from 'antd/lib/layout/layout';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import AuthService from '../../api/AuthService';

const { Title} = Typography


const ResetPasswordForm:React.FC = () => {
  const [alertMessage, setAlertMessage] =  useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>()
  const [form] = Form.useForm()
  const params = useParams()
  const navigate = useNavigate()

  const checkResetLink = async () => {
    try {
      await AuthService.reset_password_link(params.token)    
    } catch (e) {
      setError(e.response.data.message) 
    }
  }

  useEffect(() => {
    document.title = 'Сброс пароля'
    checkResetLink() 
  }, [])

  const finishHandler = async () => { 
    setIsLoading(true)
    const password = form.getFieldValue('password')
    try {
      await AuthService.accept_reset_password(params.token, {password})
      navigate({pathname: '/login'})
    } catch (e) {
      setAlertMessage(e.response.data.message)
    } finally{
      setIsLoading(false)
    } 
  }

  const closeAlert = () => {
    setAlertMessage('')
  }

  return (
    <>
    <Header className='header'>
      <Title>Сброс пароля</Title>
    </Header>
    <Content>
      {error ? <Title>{error}</Title> :
      <div className='login-form-container'>
        <Form
          onFinish={finishHandler}
          form={form}
          layout='vertical'
          className="login-form"
          initialValues={{ remember: true }}
        >
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
          <Form.Item
            name="password"
            label="Новый пароль"
            rules={[
              {
                pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
                message: 'Пароль должен содержать латинские буквы, как минимум одну цифр и длина пароля не менее 8 символов'
              },
              {
                required: true,
                message: 'Пожалуйста введите пароль!',
              },
            ]}
            hasFeedback
          >
            <Input.Password autoComplete='no'/>
          </Form.Item>

          <Form.Item
            name="confirm"
            label="Подтвердите пароль"
            dependencies={['password']}
            hasFeedback
            rules={[
              {
                required: true,
                message: 'Пожалуйста подтвердите свой пароль!',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Два пароля должны совпадать!'));
                },
              }),
            ]}
          >
            <Input.Password autoComplete='no'/>
          </Form.Item>
          <Button loading={isLoading} type="primary" htmlType="submit">
            Подтвердить
          </Button>
        </Form>
      </div>
      } 
    </Content>
  </>
  )
}

export default ResetPasswordForm