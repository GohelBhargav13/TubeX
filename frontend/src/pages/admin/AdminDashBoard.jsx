import React from "react";
import { useEffect, useState } from "react";
import SideBar from "../../component/SideBar.jsx";

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
            className="w-10 h-10 rounded-full object-cover"
          />
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex">
        {/* Sidebar */}
        <SideBar />

        {/* Dashboard Section */}
        <div className="flex-1 p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="bg-white shadow-md rounded-xl p-6 text-center">
              <p className="text-gray-600 font-semibold">User Count</p>
              <h2 className="text-2xl font-bold mt-2 text-blue-600">123</h2>
            </div>

            {/* Card 2 */}
            <div className="bg-white shadow-md rounded-xl p-6 text-center">
              <p className="text-gray-600 font-semibold">Video Count</p>
              <h2 className="text-2xl font-bold mt-2 text-blue-600">45</h2>
            </div>

            {/* Card 3 */}
            <div className="bg-white shadow-md rounded-xl p-6 text-center">
              <p className="text-gray-600 font-semibold">Highly Viewed</p>
              <h2 className="text-2xl font-bold mt-2 text-blue-600">Top 5</h2>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashBoard;
