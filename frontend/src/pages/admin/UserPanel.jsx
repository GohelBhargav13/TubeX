import React, { useEffect, useState } from "react";
import SideBar from "../../component/SideBar.jsx";
import { changeUsersRole, fetchAllUsers } from "../../API/user.api.js";
import toast from "react-hot-toast";

const UserPanel = ({ userData }) => {
  const [userDetails, setUserData] = useState([]);

  useEffect(() => {
    // Fetch All data
    const fetchUsers = async () => {
      try {
        const res = await fetchAllUsers();

        if (res?.data) {
          console.log("User Details:", res.data);
          setUserData(res.data);
        } else {
          setUserData([]);
        }
      } catch (error) {
        console.log("Error while fetching data:", error);
      }
    };

    fetchUsers();
  }, []);


  // Handle UserRole 
  const handleUserRole = async(userId,userRole) => {
    // e.preventDefault()

    console.log("Enter into the userRole Changed : ", { userId,userRole })
    const res = await changeUsersRole(userId,userRole);

    console.log("Response after change a UserRole : ", res)

    if(res?.success){
        toast.success(res?.message)
    }else {
        toast.error("Error while change a UserRole")
    }

  }

  return (
    <div className="flex h-screen bg-gray-50 font-mono">
      {/* Sidebar */}
      <SideBar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="h-16 bg-white flex items-center justify-between px-6 shadow-sm mb-6">
          <h1 className="text-2xl font-bold text-blue-600">TubeX </h1>
          <div className="flex items-center space-x-4">
            <p className="font-medium">
              {userData?.userFirstName} {userData?.userLastName}
            </p>
            <img
              src={userData?.user_avatar || "https://via.placeholder.com/40"}
              alt="User"
              className="w-10 h-10 rounded-full"
            />
          </div>
        </div>

        {/* Table Section */}
        <div className="flex-1 overflow-y-auto px-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Registered Users
          </h2>

          {userDetails.length === 0 ? (
            <p className="text-gray-500">No users found.</p>
          ) : (
            <div className="overflow-x-auto shadow-md rounded-lg">
              <table className="min-w-full border border-gray-200 text-left bg-white">
                <thead className="bg-blue-100 text-gray-700">
                  <tr>
                    <th className="py-3 px-4 border-b">#</th>
                    <th className="py-3 px-4 border-b">Avatar</th>
                    <th className="py-3 px-4 border-b">Full Name</th>
                    <th className="py-3 px-4 border-b">Email</th>
                    <th className="py-3 px-4 border-b">Role</th>
                    <th className="py-3 px-4 border-b">Joined On</th>
                    <th className="py-3 px-4 border-b">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {userDetails.map((u, idx) => (
                    <tr
                      key={u._id}
                      className="hover:bg-gray-50 transition duration-150"
                    >
                      <td className="py-3 px-4 border-b">{idx + 1}</td>
                      <td className="py-3 px-4 border-b">
                        <img
                          src={u.user_avatar || "https://via.placeholder.com/40"}
                          alt="Avatar"
                          className="w-10 h-10 rounded-full"
                        />
                      </td>
                      <td className="py-3 px-4 border-b">
                        {u.userFirstName} {u.userLastName}
                      </td>
                      <td className="py-3 px-4 border-b">{u.userEmail}</td>
                      <td className="py-3 px-4 border-b">
                      <select className="py-2 px-3 border-b-2 border-t-2 cursor-pointer"
                        value={u?.userRole}
                        onChange={(e) => handleUserRole(u?._id,e.target.value)}
                      >
                        <option value="admin" className="cursor-pointer">Admin</option>
                        <option value="user" className="cursor-pointer">User</option>
                      </select>
                        {/* {u.userRole || "User"} */}
                      </td>
                      <td className="py-3 px-4 border-b">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 border-b">
                        <select>
                            <option>ACTIVE</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserPanel;
