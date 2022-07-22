import { Alert, Button, Form, Input } from 'antd'
import React, { useState } from 'react'
import UserService from '../../api/UserService'

const tips = 'Your password must be 8-20 characters long, contain letters and numbers, and must not contain spaces, special characters, or emoji.'

enum FormNames {
  OLD_PASSWORD = 'old_password', 
  NEW_PASSWORD = 'new_password',
  REPEAT_PASSWORD = 'repeat_password'
}

const ChangePasswordForm:React.FC = () => {
  const [alertMessage, setAlertMessage] =  useState<string>('')
  const [successMessage, setSuccessMessage] =  useState<string>('')
  const [form] = Form.useForm()
  const [isSending, setIsSending] = useState<boolean>(false)

  const finishHandler = async () => {
    const formValues = form.getFieldsValue([...Object.values(FormNames)])
    if (
      formValues[FormNames.NEW_PASSWORD] !== 
      formValues[FormNames.REPEAT_PASSWORD]
    ) {
      setAlertMessage('Пароли не совпадают')
      return
    }
    const data = {...formValues }  

    try {
      setIsSending(true)
      const message = await UserService.changePassword(data)
      if(message){
        setSuccessMessage('Успешная смена пароля!')
      }
      setAlertMessage('')
      form.resetFields()
    } catch (e) {
      setAlertMessage(e.response.data.message)
    } finally {
      setIsSending(false)
    }
  }

  const closeAlert = () => {
    setAlertMessage('')
  }
  
  const closeSuccess = () => {
    setSuccessMessage('')
  }

  return (
    <Form
          onFinish={finishHandler}
          form={form}
        >
          {successMessage &&
            <Form.Item>
              <Alert 
                closable 
                onClose={closeSuccess} 
                message={successMessage} 
                type="success" 
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
          <Form.Item
            name={FormNames.OLD_PASSWORD}
            rules={[{ required: true, message: 'Пожалуйста заполните поле' }]}
          >
            <Input 
              type="password"
              autoComplete='no'
              placeholder="Старый пароль"
            />
          </Form.Item>
          <Form.Item
            name={FormNames.NEW_PASSWORD}
            rules={[
              { required: true, message: 'Пожалуйста заполните поле' },
              {
                pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
                message: 'Пароль должен содержать латинские буквы, как минимум одну цифр и длина пароля не менее 8 символов'
              },
            ]}
          >
            <Input 
              type="password"
              autoComplete='no'
              placeholder="Новый пароль"
            />
          </Form.Item>
          <Form.Item
            help={tips}
            name={FormNames.REPEAT_PASSWORD}
            rules={[{ required: true, message: 'Пожалуйста заполните поле' }]}
          >
            <Input  
              type="password"
              autoComplete='no'
              placeholder="Повторите пароль"
            />
          </Form.Item>
          <Button 
            htmlType="submit" 
            className='mt-3' 
            type='primary'
            loading={isSending}
          >
            Сменить
          </Button>
        </Form>
  )
}

export default ChangePasswordForm