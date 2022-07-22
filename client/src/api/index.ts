import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import AuthService from "./AuthService";


const $host = axios.create({
    baseURL: process.env.API_URL
})

const $authHost = axios.create({
    withCredentials: true,
    baseURL: process.env.API_URL
})


$authHost.interceptors.request.use((config: AxiosRequestConfig) => {
  
    config.headers.authorization = `Bearer ${localStorage.getItem('token')}`
    return config
})

$authHost.interceptors.response.use( (config: AxiosResponse) => {
  return config
}, async error => {
  const originalRequest = error.config
  if (error.response.status === 401 && error.config && !error.config._isRetry){
      try {    
          originalRequest._isRetry = true 
          const response = await AuthService.refresh()
          
          localStorage.setItem('token', response.data.accessToken)
          return $authHost.request(originalRequest)
      } catch (e) {
          console.log('Неавторизованный пользователь');
      }
  }
  throw error
})

export {
    $host,
    $authHost
}
