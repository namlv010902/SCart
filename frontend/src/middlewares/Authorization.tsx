import React, { ReactNode, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGetTokenQuery } from '../services/auth.service'
interface AuthorizationProps {
  children: ReactNode;
}
const Authorization = ({ children }: AuthorizationProps) => {
  const { data, error, isSuccess} = useGetTokenQuery()
  const navigate = useNavigate()

  useEffect(() => {
    if ( data && isSuccess) {
      if (data?.data?.role != "admin") {
        navigate("/")
      }
      return
    }
    if (error) {
      navigate("/")
    }
  }, [ error,data,isSuccess])
  return (
    <>{children}</>
  )
}

export default Authorization