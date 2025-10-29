import "./App.css";
import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import ProtectedRoute from "./utills/ProtectedRoute.jsx";
import HomePage from "./pages/HomePage.jsx";
import Liked from  "./pages/LikedVideos.jsx"
import UserVideos from "./pages/UserVideos.jsx"
import { useUserAuthStore } from "./store/auth.store.js";
import WatchVideo from "./pages/WatchVideo.jsx";
import AdminProtectedRoute from "./utills/AdminProtectedRoute.jsx";
import VideoUploadPage from "./pages/admin/VideoUploadPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import VideoUpdatePage from "./pages/admin/VideoUpdatePage.jsx";
import UpdateAVideo from "./pages/admin/UpdateAVideo.jsx";
import CheckRoute from "./utills/CheckRoute.jsx";


function App() {

  const setUserData = useUserAuthStore((state) => state.setUserData)
  const userData = useUserAuthStore((state) => state.userData)

  console.log(userData)

  useEffect(() => {
   setUserData()
  },[])
  
  return (

    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={ <RegisterPage /> } />
      <Route path="/home" element={<ProtectedRoute> <HomePage /> </ProtectedRoute>} />
      <Route path="/liked" element={ <ProtectedRoute> <Liked /> </ProtectedRoute> } />
      <Route path="/uvideos" element={ <ProtectedRoute> <UserVideos /> </ProtectedRoute> } />
      <Route path="/watch/:videoId" element={ <ProtectedRoute> <WatchVideo /> </ProtectedRoute> } />
      <Route path="/admin/video-upload" element={ <AdminProtectedRoute> <VideoUploadPage userData={userData} /> </AdminProtectedRoute>  } />
      <Route path="/admin/video-update" element={ <AdminProtectedRoute> <VideoUpdatePage userData={userData } /> </AdminProtectedRoute> } />
      <Route path="/admin/update-video/:videoId" element={ <AdminProtectedRoute> <UpdateAVideo userData={userData } /> </AdminProtectedRoute> } />
      <Route path="*" element={ <CheckRoute userData={userData} /> } />
    </Routes>
  );
}

export default App;
