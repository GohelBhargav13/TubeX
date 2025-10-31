import React, { useEffect, useState } from "react";
import SideBar from "../../component/SideBar.jsx";
import { changeUsersRole, fetchAllUsers } from "../../API/user.api.js";
import toast from "react-hot-toast";
import socket from "../../Server/Server.js";

const UserPanel = ({ userData }) => {
  const [userDetails, setUserData] = useState([]);
    const [searchWords, setSearchWords] = useState("");
    const [searchedData, setSearchData] = useState([]);

  useEffect(() => {
    // Fetch All data
    const fetchUsers = async () => {
      try {
        const res = await fetchAllUsers();

        if (res?.data) {
          console.log("User Details:", res.data);
          setUserData(res?.data);
          setSearchData(res?.data)
        } else {
          setUserData([]);
        }
      } catch (error) {
        console.log("Error while fetching data:", error);
      }
    };
    fetchUsers();

    socket.on("UserRoleChanged", ({ newUserRole,userId,message,success }) => {
      console.log("flag is :", success)
        if(success && userData?.userRole === "admin"){
          console.log({ userId, newUserRole })
          toast.success(message)
          fetchUsers();
          return;
        }else {
          toast.error("Error While Updating Role")
        }
    })

    return () => {
      socket.off("UserRoleChanged")
    }
  }, []);

  // Handle UserRole
  const handleUserRole = async (userId, userRole) => {
    // e.preventDefault()

    socket.emit("userRoleChange", { userId, userRole } )

    console.log("Enter into the userRole Changed : ", { userId, userRole });
    // const res = await changeUsersRole(userId, userRole);

    // console.log("Response after change a UserRole : ", res);

    // if (res?.success) {
    //   toast.success(res?.message);
    //   setTimeout(() => window.location.reload(), 1500);
    // } else {
    //   toast.error("Error while change a UserRole");
    // }
  };

  // handle Search method for filter search
  const handleSearch = async () => {
    setSearchData(userDetails)
    if(searchWords.trim()){
       setSearchData((prev) => prev.filter((ud) => ud?.userFirstName.toLowerCase().includes(searchWords.toLowerCase())))
    }else {
      setSearchData(userDetails)
    }
   
  }

  return (
    <>
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
       <div className="bg-neutral-50 p-1 flex justify-center items-center font-mono">
        {/* <p>Search Bar</p> */}
        <p className="text-gray-950 p-3 bg-gray-200 rounded">
          Search : {searchedData?.length}
        </p>
        <input
          type="text"
          id="search"
          required
          value={searchWords}
          onChange={(e) => setSearchWords(e.target.value)}
          className="w-1/2 px-4 py-3 m-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition duration-150 text-gray-800"
          placeholder="Search videos..."
          autoComplete="username"
        />
        <button
          className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
          onClick={handleSearch}
        >
          {" "}
          🔍 Search
        </button>
      </div>
      <div className="flex h-screen bg-gray-50 font-mono">
        {/* Sidebar */}
        <SideBar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Table Section */}
          <div className="flex-1 overflow-y-auto px-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Registered Users
            </h2>

            {searchedData.length === 0 ? (
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
                    {searchedData.map((u, idx) => (
                      <tr
                        key={u._id}
                        className="hover:bg-gray-50 transition duration-150"
                      >
                        <td className="py-3 px-4 border-b">{idx + 1}</td>
                        <td className="py-3 px-4 border-b">
                          <img
                            src={
                              u.user_avatar || "https://via.placeholder.com/40"
                            }
                            alt="Avatar"
                            className="w-10 h-10 rounded-full"
                          />
                        </td>
                        <td className="py-3 px-4 border-b">
                          {u.userFirstName} {u.userLastName}
                        </td>
                        <td className="py-3 px-4 border-b">{u.userEmail}</td>
                        <td className="py-3 px-4 border-b">

                          <select
                            className="py-2 px-3 border-b-2 border-t-2 cursor-pointer"
                            value={u?.userRole}
                            onChange={(e) =>
                              handleUserRole(u?._id, e.target.value)
                            }

                            disabled={ u?._id === userData?._id }
                          >
                            <option value="admin" className="cursor-pointer">
                              Admin
                            </option>
                            <option value="user" className="cursor-pointer">
                              User
                            </option>
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
    </>
  );
};

export default UserPanel;
