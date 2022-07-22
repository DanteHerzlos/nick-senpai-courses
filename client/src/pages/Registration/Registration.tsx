import React, { useEffect, useState } from 'react'
import { Button, Form, Typography, Input, Row, Alert } from 'antd'
import { Content, Header } from 'antd/lib/layout/layout'
import { Link, useNavigate} from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import { registration } from '../../store/reducers/user/ActionCreators'

const { Title} = Typography

const Registration:React.FC = () => {
  const [alertMessage, setAlertMessage] = useState<string>('')
  const [form] = Form.useForm()
  const dispatch = useAppDispatch()
  const {error, registrationLoading} = useAppSelector((state) => state.userReducer)
  const navigate = useNavigate()
  

  useEffect(() => {
    document.title = 'Регистрация'
  }, [])

  useEffect(() => {
    if(error){
      setAlertMessage(error)     
    }
  }, [registrationLoading])

  const closeAlert = () => {
    setAlertMessage('')
  }

  const finishHandler = async () => { 
    const registrationData = form.getFieldsValue(['email', 'password', 'username'])
    const result = await dispatch(registration(registrationData))
   
    if(result === 'success'){
      navigate('/login?success=true')
    }    
  }

  return (
  <>
    <Header className='header'>
      <Title>Регистрация</Title>
    </Header>
    <Content> 
      <div className='login-form-container'>
        <Form
          onFinish={finishHandler}
          form={form}
          layout='vertical'
          name="normal_login"
          className="login-form"
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
            name="email"
            label="E-mail"
            rules={[
              {
                type: 'email',
                message: 'Некорректный E-mail!',
              },
              {
                required: true,
                message: 'Пожалуйста введите E-mail!',
              },
            ]}
          >
            <Input autoComplete='no'/>
          </Form.Item>
          <Form.Item
            name="password"
            label="Пароль"
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

          <Form.Item
            name="username"
            label="Имя"
            tooltip="What do you want others to call you?"
            rules={[{ required: true, message: 'Пожалуйста введите свое имя!', whitespace: true }]}
          >
            <Input autoComplete='no'/>
          </Form.Item >
          <Form.Item>
            <Row justify='space-between'>
              <Button loading={registrationLoading} type="primary" htmlType="submit">
                Регистрация
              </Button>
              <Link to='/login'>Уже зарегистрирован?</Link>
            </Row>
          </Form.Item>
        </Form>
      </div>
    </Content>
  </>
  )
}

export default Registration