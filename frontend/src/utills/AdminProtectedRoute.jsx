import React from 'react'
import { Navigate } from 'react-router-dom'
import { useUserAuthStore } from "../store/auth.store.js"

const AdminProtectedRoute = ({ children }) => {

  const { userData,isFetching,isChecked  } = useUserAuthStore()

  if(isFetching || !isChecked) return <h1>Loading...</h1>

  if(!userData) return <Navigate to="/login" />
  return userData?.userRole === "admin" ? children : <Navigate to="/home" />
}

export default AdminProtectedRoute  