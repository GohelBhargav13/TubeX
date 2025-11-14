import React, { useEffect, useState } from "react";
import SideBar from "../../component/SideBar.jsx";
import {
  fecthVideoCounts,
  fetchUserAndAdminCounts,
} from "../../API/aggregation.pipeline.js";
import { Loader2 } from "lucide-react";
import { fetchUsersAndVideos } from "../../API/video.api.js";
import VideoPlayer from "../../component/VideoPlayer.jsx";

const AdminDashBoard = ({ userData }) => {
  const [userCount, setUserCount] = useState(0);
  const [adminCount, setAdminCount] = useState(0);
  const [videoCount, setVideoCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [usersData, setUsersData] = useState([]);
  const [videosData, setVideosData] = useState([]);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);

        // Fetch user and admin counts
        const res = await fetchUserAndAdminCounts();
        if (res?.data) {
          setUserCount(res?.data?.userCount)
          setAdminCount(res?.data?.adminCount)
        }

        // Fetch video count
        const videoRes = await fecthVideoCounts();
        if (videoRes?.videoCounts) {
          setVideoCount(videoRes.videoCounts);
        }

        // Fetch recent users and videos
        const result = await fetchUsersAndVideos();
        if (result?.Status === "good") {
          setUsersData(result?.userData);
          setVideosData(result?.videoData);
        } else {
          setUsersData([]);
          setVideosData([]);
        }
      } catch (error) {
        console.log("Error while fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  return (
    <>
      {/* Header */}
      <div className="h-16 bg-gray-950 text-white flex items-center justify-between px-6 shadow-sm border-b-2 border-b-white font-mono">
        <h1 className="text-2xl font-bold">TubeX</h1>
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

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin text-blue-600 w-8 h-8" />
        </div>
      ) : (
        <div className="flex min-h-screen bg-linear-to-b from-gray-800 to-black">
          {/* Sidebar */}
          <SideBar />

          {/* Dashboard Content */}
          <div className="flex-1 p-6 space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-linear-to-r from-slate-800 to-black shadow-md rounded-xl p-6 text-center">
                <p className="text-white font-semibold">User Count</p>
                <h2 className="text-2xl font-bold mt-2 text-blue-600">
                  {userCount}
                </h2>
              </div>

              <div className="bg-linear-to-r from-slate-800 to-black shadow-md rounded-xl p-6 text-center">
                <p className="text-white font-semibold">Admin Count</p>
                <h2 className="text-2xl font-bold mt-2 text-blue-600">
                  {adminCount}
                </h2>
              </div>

              <div className="bg-linear-to-r from-slate-800 to-black shadow-md rounded-xl p-6 text-center">
                <p className="text-white font-semibold">Video Count</p>
                <h2 className="text-2xl font-bold mt-2 text-blue-600">
                  {videoCount}
                </h2>
              </div>

              <div className="bg-linear-to-r from-slate-800 to-black shadow-md rounded-xl p-6 text-center">
                <p className="text-white font-semibold">Highly Viewed</p>
                <h2 className="text-2xl font-bold mt-2 text-blue-600">Top 5</h2>
              </div>
            </div>

            {/* Recent Users & Videos Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Recent Users */}
              <div className="bg-slate-800 shadow-md rounded-xl p-6">
                <h2 className="text-lg font-semibold text-neutral-200 mb-4 border-b pb-2">
                  Recent Users
                </h2>
                {usersData.length > 0 ? (
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="text-center text-neutral-300 border-b">
                        <th className="py-2">No.</th>
                        <th className="py-2">Name</th>
                        <th className="py-2">Email</th>
                        <th className="py-2">Role</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usersData.map((u, idx) => (
                        <tr
                          key={idx}
                          className="border-b hover:bg-gray-50 hover:cursor-pointer hover:text-slate-950 text-white hover:scale-105 duration-500 hover:border-b-4  hover:border-blue-500 transition"
                        >
                          <td>{ idx + 1 }</td>
                          <td className="py-2 font-medium">
                            {u?.userFirstName} {u?.userLastName}
                          </td>
                          <td className="py-2">{u?.email || "N/A"}</td>
                          <td className="py-2 capitalize">{u?.userRole}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-white text-sm">No recent users found.</p>
                )}
              </div>

              {/* Recent Videos */}
              <div className="bg-slate-800 shadow-md rounded-xl p-6">
                <h2 className="text-lg font-semibold text-neutral-100 mb-4 border-b pb-2">
                  Recent Videos
                </h2>
                {videosData.length > 0 ? (
                  <div className="space-y-3">
                    {videosData.map((v, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 border-b pb-2 hover:cursor-pointer hover:bg-gray-50 text-white hover:border-b-4 hover:border-b-blue-500 hover:scale-105 duration-500 hover:text-slate-950 transition rounded-lg p-2"
                      >

                      <VideoPlayer videoURL={v?.videoUrl} width={70} height={70} />
                        <div className="flex-1 justify-items-start">
                          <p className="font-medium truncate">
                            {v?.videoTitle.length > 30 ? v?.videoTitle.slice(0,30) + '...' : v?.videoTitle }
                          </p>
                          <p className="text-xs text-gray-500">
                            Uploaded by: {v?.videoOwner.userFirstName || "Unknown"}
                          </p>
                        </div>
                        <span className="text-sm text-blue-600 font-semibold">
                          {v?.views || 1} views
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">
                    No recent videos found.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminDashBoard;
