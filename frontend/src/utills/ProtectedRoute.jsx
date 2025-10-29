
import { useEffect } from "react";
import { Navigate } from 'react-router-dom'
import { useUserAuthStore } from "../store/auth.store.js"

const ProtectedRoute = ({ children }) => {

    // UserData Fetch from the store
    const { userData,isFetching,isChecked } = useUserAuthStore();

      if(userData !== null && userData !== undefined) {
        <Navigate to="/home" />
    }
    
    if(isFetching || !isChecked) return <h1>Loading...</h1>

    return userData ? children : <Navigate to="/login" />
}

export default ProtectedRoute