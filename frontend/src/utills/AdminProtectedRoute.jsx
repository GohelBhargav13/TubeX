import React from 'react'
import { Navigate } from 'react-router-dom'

const AdminProtectedRoute = ({ user,children }) => {

  if(!user) return <Navigate to="/login" />
  return user.userRole === "admin" ? children : <Navigate to="/home" />
}

export default AdminProtectedRoute