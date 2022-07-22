import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector} from '../hooks/redux'
import { checkAuth } from '../store/reducers/user/ActionCreators'
import Loader from './Loader/Loader'
import AppRouter from './AppRouter/AppRouter'


const App: React.FC = () => {
  const dispatch = useAppDispatch()
  const { isLoading } = useAppSelector((state) => state.userReducer)

  useEffect( () => {
    if (localStorage.getItem('token')){
      dispatch(checkAuth())
    }
  }, [])


  return (
    <>
    {isLoading 
      ? <Loader/>
      : <AppRouter/>
    }
    </>
  )
}

export default App