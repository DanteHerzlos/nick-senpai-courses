import React, { useEffect, useState } from 'react'
import { Alert, Button, Form, Input, Row, Typography } from 'antd'
import { Content, Header } from 'antd/lib/layout/layout'
import './ResetPassword.sass'
import AuthService from '../../api/AuthService'

const {Title } = Typography

const ResetPassword = () => {
  const [form] = Form.useForm()
  const [isSending, setIsSending] = useState<boolean>(false)
  const [successMessage, setSuccessMessage] = useState<string>('')

  useEffect(() => {
    document.title = 'Сброс пароля'
  }, [])

  const finishHandler = async () => {
    const formValues = form.getFieldsValue(['email'])
    const data = {...formValues}
    try {
      setIsSending(true)
      const response = await AuthService.reset_password(data)
      setSuccessMessage(response.data)
    } catch (e) {
      console.log(e.response.data.message)
    } finally {
      setIsSending(false)
    }
  }

  const closeAlert = () => {
    setSuccessMessage('')
  }

  return (
    <>
    <Header className='header'>
      <Title>Сброс пароля</Title>
    </Header>
    <Content>
      <div className='reset-password-form-container'>
        <Form
          onFinish={finishHandler}
          form={form}
          layout='vertical'
          name="basic"
          autoComplete="off"     
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
          <Form.Item
            
            className='reset-password-form '
            label="E-mail"
            name="email"
            rules={[
              { 
                required: true, 
                message: 'Пожалуйста введите адрес электронной почты!'
              },
              {
                type: 'email',
                message: 'Некорректный E-mail!',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Row justify='end'>
            <Button loading={isSending} type="primary" htmlType="submit">
              Сбросить
            </Button>
          </Row>
        </Form>
      </div>
    </Content>
  </>
  )
}

export default ResetPassword