import React, { useEffect, useState } from "react";
import SideBar from "../../component/SideBar.jsx";
import {
  changeUsersRole,
  fetchAllUsers,
  UserDeleteProfile,
} from "../../API/user.api.js";
import toast from "react-hot-toast";
import socket from "../../Server/Server.js";
import { Loader2, Trash2 } from "lucide-react";
import UserAvatar from "../../component/UserAvatar.jsx";

const UserPanel = ({ userData }) => {
  const [userDetails, setUserData] = useState([]);
  const [searchWords, setSearchWords] = useState("");
  const [searchedData, setSearchData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    
    // Fetch All data when page is load
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await fetchAllUsers();

        if (res?.data) {
          console.log("User Details:", res.data);
          setUserData(res?.data);
          setSearchData(res?.data);
        } else {
          setUserData([]);
        }
      } catch (error) {
        setLoading(false);
        console.log("Error while fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();

    // User Role changed socket event
    socket.on(
      "UserRoleChanged",
      ({ newUserRole, userId, message, success }) => {
        console.log("flag is :", success);
        if (success && userData?.userRole === "admin") {
          console.log({ userId, newUserRole });
          toast.success(message);
          fetchUsers();
          return;
        } else {
          toast.error("Error While Updating Role");
        }
      }
    );

    // New user joined socket event
    socket.on("newUserJoined",({ userdata,message }) => {
        console.log("New User Joined : ",userdata)

        // update the user details state
        userDetails((prev) => [...prev,userdata])
        if(userData?.userRole === 'admin' && message) toast.success(message)
    })

    socket.on("userpanelupdated",({ userId, message }) => {
        console.log("User Deleted : ",userId)
        setUserData((prev) => prev.filter((user) => user?._id !== res?.data?.userId));
        if(userData?.userRole === 'admin' && message) toast.success(message)
    })

    // unmount the socket 
    return () => {
      socket.off("UserRoleChanged");
      socket.off("newUserJoined")
      socket.off("userpanelupdated")
    };
  }, []);

  // Handle UserRole
  const handleUserRole = async (userId, userRole) => {
    // e.preventDefault()

    socket.emit("userRoleChange", { userId, userRole });

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
    setSearchData(userDetails);
    if (searchWords.trim()) {
      setSearchData((prev) =>
        prev.filter((ud) =>
          ud?.userFirstName.toLowerCase().includes(searchWords.toLowerCase())
        )
      );
    } else {
      setSearchData(userDetails);
    }
  };

  // delete user function
  const deleteUser = async (userId) => {
    if (!userId) {
      console.log("User id is not found");
      return;
    }

    console.log("Button clicked")
    const res = await UserDeleteProfile(userId);

    console.log("response is :", res)

    if (res?.StatusCode >= 400 || !res?.success) {
      toast.error(res?.message || "Error in deleting the user details");
      return;
    }

    if (res?.StatusCode === 200 && res?.success) {
      toast.success(res?.message || "User is deleted");
      socket.emit("userDeleted",{ userId })
      return;
    }
  };

  if (loading) {
    return (
      <div className="text-blue-500 items-center">
        <Loader2 className="animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="h-16 bg-gray-950 text-white flex items-center justify-between px-6 shadow-sm border-b-2 border-b-white">
        <h1 className="text-2xl font-bold">TubeX </h1>
        <div className="flex items-center space-x-4">
          <p className="font-medium">
            {userData?.userFirstName} {userData?.userLastName}
          </p>
          <UserAvatar username={userData?.userFirstName} />
        </div>
      </div>
      <div className="bg-gray-900 p-1 flex justify-center items-center font-mono">
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
          className="w-1/2 px-4 py-3 m-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition duration-150 text-white"
          placeholder="Search Users..."
          autoComplete="username"
        />
        <button
          className="bg-gray-800 hover:bg-gray-950 hover:scale-105 duration-500 text-white font-bold py-2 px-4 rounded cursor-pointer"
          onClick={handleSearch}
        >
          {" "}
          🔍 Search
        </button>
      </div>
      <div className="flex h-screen bg-linear-to-b from-gray-800 to-black font-mono border-t-2 border-t-white">
        {/* Sidebar */}
        <SideBar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Table Section */}
          <div className="flex-1 overflow-y-auto px-8">
            <h2 className="text-xl font-semibold text-white text-center mt-4 mb-4">
              Registered Users
            </h2>

            {searchedData.length === 0 ? (
              <p className="text-white">No users found.</p>
            ) : (
              <div className="overflow-x-auto shadow-md rounded-lg">
                <table className="min-w-full border border-gray-200 text-left bg-slate-800 text-white">
                  <thead className="bg-blue-100 text-gray-950">
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
                        className="hover:bg-neutral-200 hover:text-slate-950 font-bold transition duration-150"
                      >
                        <td className="py-3 px-4 border-b">{idx + 1}</td>
                        <td className="py-3 px-4 border-b">
                          <UserAvatar username={u?.userFirstName} />
                        </td>
                        <td className="py-3 px-4 border-b">
                          {u.userFirstName} {u?.userLastName}
                        </td>
                        <td className="py-3 px-4 border-b">{u?.userEmail}</td>
                        <td className="py-3 px-4 border-b">
                          <select
                            className="py-2 px-3 border-b-2 border-t-2 cursor-pointer"
                            value={u?.userRole}
                            onChange={(e) =>
                              handleUserRole(u?._id, e.target.value)
                            }
                            disabled={u?._id === userData?._id}
                          >
                            <option
                              value="admin"
                              className="cursor-pointer text-black"
                            >
                              Admin
                            </option>
                            <option
                              value="user"
                              className="cursor-pointer text-black"
                            >
                              User
                            </option>
                          </select>
                          {/* {u.userRole || "User"} */}
                        </td>
                        <td className="py-3 px-4 border-b">
                          {new Date(u?.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 border-b">
                          <div>
                            <button
                              className={`text-white hover:scale-110 duration-400 
                                hover:shadow-lg bg-slate-900 p-2 rounded-xl
                                hover:text-white
                                ${
                                  u?._id === userData?._id
                                    ? "cursor-not-allowed opacity-50"
                                    : "cursor-pointer"
                                }`}
                              onClick={() => deleteUser(u?._id)}
                              disabled={u?._id === userData?._id}
                            >
                              <Trash2 />
                            </button>
                          </div>
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
