import React, { useEffect, useState } from 'react'
import { useUserAuthStore } from "../store/auth.store.js"
import { getAllVideos, userLikedVideos } from "../API/video.api.js"
import SideBar from '../component/SideBar.jsx';
import VideoPlayer from '../component/VideoPlayer.jsx';
import { Loader2, MessageCircle, ThumbsUp, User } from 'lucide-react';
import UserAvatar from '../component/UserAvatar.jsx';

const LikedVideos = () => {

  const { userData } = useUserAuthStore();
  const [likedVideos,setLikedVideos] = useState([])
  const [loading,setLoading] = useState(false);
  const [searchWords,setSearchWords] = useState("")
  const [searchedData,setSearchData] = useState([])

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        setLoading(true);
        const res = await userLikedVideos();
        console.log("Liked Video response : ", res?.data);

        if(res?.data?.StatusCode === 404) return setLikedVideos([])

          
        // set first all videos than filter
        if(res?.data !== null || res?.data?.length > 0 || res?.data !== undefined){
             setLikedVideos(res?.data);
             setSearchData(res?.data)
        }
       
        
      } catch (error) {
        setLoading(false);
        console.log("Error in fetch liked video for the user : ",error)
      }finally {
        setLoading(false)
      }

    }
    fetchVideo()

    console.log("Liked Videos are : ",likedVideos)

  },[])

   // handle a Dynamic Search
  const handleSearch = () => {
    if(searchWords.trim()){
        setSearchData(videos);
        setSearchData((prev) => prev.filter((v) => v?.videoTitle.toLowerCase().includes(searchWords.toLowerCase())))
    }else {
      setSearchData(videos)
    }
  }
  
  return (
    <div className='bg-gray-900'>
     {/* Header */}
        <div className="h-16 bg-gray-950 flex items-center border-b-2 border-b-white justify-between px-6 shadow-sm font-mono">
          <h1 className="text-2xl font-bold text-white">TubeX</h1>
          <div className="flex items-center space-x-4">
            <p className="font-medium text-white">
              {userData?.userFirstName} {userData?.userLastName}
            </p>
             <UserAvatar username={userData?.userFirstName} />
          </div>
        </div>

        <div className="bg-gray-900 p-1 flex justify-center items-center font-mono">
        {/* <p>Search Bar</p> */}
         <p className="text-gray-950 p-3 bg-gray-200 rounded">Search : { searchedData?.length }</p>
        <input
              type="text"
              id="search"
              required
              value={searchWords}
              onChange={(e) => setSearchWords(e.target.value) }
              className="w-1/2 px-4 py-3 m-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition duration-150 text-white"
              placeholder="Search videos..."
              autoComplete="username"
            />
            <button className="bg-gray-800 hover:bg-gray-950 hover:scale-105 duration-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
            onClick={handleSearch}> 🔍 Search</button>
           
      </div>
    <div className="flex min-h-screen bg-linear-to-b from-slate-900 to-black text-white border-t-2 border-t-white text-center">
      {/* Sidebar */}
      <SideBar />
      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">

        {/* Liked Videos Section */}
        <div className='font-mono'>
          <h2 className="text-xl font-semibold mb-4">
            ❤️ Liked Videos
          </h2>

          { loading && <Loader2 className='animate-spin mx-auto text-blue-600 my-4' /> }

          {!loading && searchedData?.length === 0 ? (
            <p className="text-gray-500 text-sm">
              You haven’t liked any videos yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchedData?.length > 0 && searchedData?.map((video) => (
                <div
                  key={video._id}
                  className="bg-slate-800 hover:bg-slate-900 hover:scale-105 duration-700 rounded-lg shadow-sm hover:shadow-md transition p-3"
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
                  <p className="text-neutral-500 text-xs mb-2 line-clamp-2 flex justify-items-start ">
                    {video.videoDescription}
                  </p>
                  <div className="flex items-center space-x-4 text-white text-sm gap-3 justify-center">
                    <div className="flex items-center space-x-1">
                      <span><ThumbsUp />  </span>
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
    </div>
  )
}

export default LikedVideos