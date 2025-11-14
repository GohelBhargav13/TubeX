import React, { useEffect, useState } from 'react'
import { userVideos } from '../API/video.api.js'
import SideBar from '../component/SideBar'
import { useUserAuthStore } from  "../store/auth.store.js"
import VideoPlayer from '../component/VideoPlayer'
import { Loader2, MessageCircle, ThumbsUp } from 'lucide-react'
import UserAvatar from '../component/UserAvatar.jsx'

const UserVideos = () => {

  const { userData } = useUserAuthStore();

  const [userVideoslist,setUserVideos] = useState([])
  const [loading,setLoading] = useState(false)

  useEffect(() => {
    const getUserVideos = async () => {
      try {
          setLoading(true)
         const res =  await userVideos()
         console.log("User videos are : ", res?.data)

        if(res?.data?.StatusCode === 404 || res?.data === undefined) return setUserVideos([])

        // set first all videos than filter
        if(res?.data !== null || res?.data?.length > 0 || res?.data !== undefined){
             setUserVideos(res?.data);
        }

      } catch (error) {
        setLoading(false)
        console.log("Error from the catch part of user videos : ",error)
      }finally {
          setLoading(false)
      }
    }
    getUserVideos();

  },[])

  return (
    <>
     {/* Header */}
        <div className="h-16 bg-gray-950 border-b-2 border-b-white flex items-center justify-between px-6 shadow-sm  font-mono">
          <h1 className="text-2xl font-bold text-white">TubeX</h1>
          <div className="flex items-center space-x-4">
            <p className="font-medium text-white">
              {userData?.userFirstName} {userData?.userLastName}
            </p>
              <UserAvatar username={userData?.userFirstName} />
          </div>
        </div>
      <div className="flex min-h-screen bg-linear-to-b from-gray-900 to-black text-white text-center font-mono">
      {/* Sidebar */}
      <SideBar />

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
    
        {/* Liked Videos Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4">
            ✅ User Videos
          </h2>

          {loading && <Loader2 className='animate-spin mx-auto text-blue-500'/> }

          {!loading && userVideoslist?.length === 0 ? (
            <p className="text-gray-500 text-sm">
              You haven’t any videos yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {userVideoslist.map((video) => (
                <div
                  key={video._id}
                  className="bg-slate-800 hover:bg-slate-900 hover:scale-105 duration-500 text-white rounded-lg shadow-sm hover:shadow-md transition p-3"
                >
                  <div className="rounded-md overflow-hidden mb-2">
                    <VideoPlayer
                      videoURL={video?.videoUrl}
                      width="100%"
                      height="180px"
                      controls
                    />
                  </div>
                  <div className="flex items-center space-x-3 mb-2">
                    <UserAvatar username={video.videoOwner?.userFirstName} />
                    <div>
                      <p className="font-semibold text-sm">
                        {video.videoOwner?.userFirstName}{" "}
                        {video.videoOwner?.userLastName}
                      </p>
                      <p className="text-xs text-gray-500">Uploader</p>
                    </div>
                  </div>
                  <h3 className="font-bold text-neutral-400 text-sm line-clamp-1 flex justify-items-start">
                    {video.videoTitle}
                  </h3>
                  <p className="text-neutral-500 text-xs mb-2 line-clamp-2 flex justify-items-start">
                    {video.videoDescription}
                  </p>
                  <div className="flex items-center space-x-4 text-sm gap-3 justify-center">
                    <div className="flex items-center space-x-1">
                      <span><ThumbsUp /></span>
                      <p>{video.LikeCounts || video.videoLikes?.length}</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span><MessageCircle /></span>
                      <p>{video.CommentCounts || video.videoComments?.length}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  )
}

export default UserVideos