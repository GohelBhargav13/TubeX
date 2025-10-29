import React from 'react'
import { useEffect,useState } from 'react'
import SideBar from '../../component/SideBar.jsx'

const AdminDashBoard = ({ userData }) => {

  return (
    <>
    {/* Header */}
      <div className="h-16 bg-white flex items-center justify-between px-6 shadow-sm mb-6 font-mono">
        <h1 className="text-2xl font-bold text-blue-600">TubeX</h1>
        <div className="flex items-center space-x-4">
          <p className="font-medium">
            {userData?.userFirstName} {userData?.userLastName}
          </p>
          <img
            src={userData?.user_avatar || "https://via.placeholder.com/320x180"}
            alt="User"
            className="w-10 h-10 rounded-full"
          />
        </div>
      </div>
        <p>Admin Panel</p>
        <SideBar />
    </>
  )
}

export default AdminDashBoard