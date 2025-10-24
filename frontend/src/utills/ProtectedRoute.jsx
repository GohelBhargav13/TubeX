
import { useEffect } from "react";
import { useUserAuthStore } from "../store/auth.store.js"
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children }) => {
    // UserData Fetch from the store
    const { userData,isFetching } = useUserAuthStore.getState();

    if(isFetching) return <h1>Loading...</h1>
    return userData ? children : <Navigate to="/login" />
}

export default ProtectedRoute