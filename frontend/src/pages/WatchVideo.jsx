import React,{ useEffect, useState } from 'react'
import { getVideoById } from '../API/video.api.js'
import { useParams } from  "react-router-dom"
import toast from 'react-hot-toast'
import { MessageCircle,ThumbsUp,ThumbsUpIcon } from "lucide-react"
import SideBar from '../component/SideBar.jsx'
import { useUserAuthStore } from "../store/auth.store.js"
import VideoPlayer from '../component/VideoPlayer.jsx'
import CommentSection from '../component/CommentSection.jsx'

const WatchVideo = () => {
    
    const [videoDetails, setVideoDetails] = useState({})
    const { videoId } = useParams();
     const { userData } = useUserAuthStore();

    const mainVideo = "https://www.w3schools.com/html/mov_bbb.mp4";

  const relatedVideos = [
    { id: 1, title: "Video 1", url: "https://www.w3schools.com/html/mov_bbb.mp4" },
    { id: 2, title: "Video 2", url: "https://www.w3schools.com/html/movie.mp4" },
    { id: 3, title: "Video 3", url: "https://www.w3schools.com/html/mov_bbb.mp4" },
  ];

  const [currentVideo, setCurrentVideo] = useState(mainVideo);

    useEffect(() => {
        // check if videoId is not available
        if(!videoId) return;

        // fetch video by ID 
        const fetchVideo = async (videoId) => {
            try {
               const res = await getVideoById(videoId)
               console.log("Response at the react side : ",res)

               if(res?.data !== null){
                    setVideoDetails(res?.data)
                    toast.success(res?.message || "Video Fetched Successfully")
                    return;
               }else {
                    toast.error(res?.message || "Video Can't Fetched")
                    return
               }
                
            } catch (error) {
                console.log("Error from catch video is not fetched : ",error)
                return;
            }
        }
        fetchVideo(videoId)  

    },[videoId])

  return (
    <>
   <div className="flex min-h-screen bg-white">
      {/* Left Sidebar - YouTube's main navigation */}
      {/* Keeping w-1/5 as per your original structure, though YouTube's is often narrower */}
        <SideBar />

      {/* Center Main Video and Details */}
      <div className="flex-1 p-6 overflow-y-auto flex flex-col max-w-[calc(100%-25%)]">
        
        {/* Top Bar - Keeping your original top bar for the site header/user profile */}
        <div className="h-10 bg-white flex items-center justify-between px-0 mb-4">
          <h1 className="text-2xl font-bold text-red-600">TubeX</h1>
          <div className="flex items-center space-x-4">
            <p className="font-medium text-sm">{userData?.userFirstName} {userData?.userLastName}</p>
            <img
              src={userData?.user_avatar || "https://placehold.co/600x400/png"}
              alt="User"
              className="w-10 h-10 rounded-full cursor-pointer"
            />
          </div>
        </div>
        
        {/* Video Player - Adjusted height for a more standard aspect ratio */}
        <div className="w-full mb-6 rounded-lg overflow-hidden shadow-lg">
          <VideoPlayer videoURL={videoDetails?.videoUrl} width="100%" height="550px"  config={ { youtube:{ playerVars: { autoplay: 1 } } } } />
        </div>
        
        {/* Video Metadata */}
        <div className="pb-4 border-b border-gray-200">
          <h1 className="font-bold text-2xl mb-2 text-gray-900">
            {videoDetails?.videoTitle}
          </h1>
          
          <div className="flex justify-between items-center text-gray-600 text-sm">
            <div className='flex items-center space-x-4'>
                <p className="font-semibold">{videoDetails.views || 1} views</p>
                <span className="text-xs">•</span>
                <p>{videoDetails?.createdAt?.slice(0,10) || undefined}</p>
            </div>
            {/* Like/Dislike/Share Buttons Placeholder */}
            <div className='flex items-center space-x-5'>
                <button className='flex items-center gap-0.5 cursor-pointer space-x-1 hover:text-red-600 transition'>
                    <span className="text-xl"><ThumbsUp /></span>
                    <span className='font-medium'>{ videoDetails?.videoLikes?.length }</span>
                </button>
                <button className='flex items-center gap-0.5 cursor-pointer space-x-1 hover:text-red-600 transition'>
                    <span className="text-xl"><MessageCircle /></span>
                    <span className='font-medium'>{ videoDetails?.videoComments?.length }</span>
                </button>
                {/* <button className='font-medium hover:text-red-600 transition'>SHARE</button> */}
            </div>
          </div>
        </div>

        {/* Channel Info and Description */}
        <div className="mt-4 pb-6 border-b border-gray-200">
            <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                    <img
                        src={videoDetails?.videoOwner?.user_avatar || "" }
                        alt={videoDetails?.videoOwner?.userFirstName}
                        className="w-12 h-12 rounded-full cursor-pointer"
                    />
                    <div>
                        <p className="font-bold text-md text-gray-900 hover:text-red-600 cursor-pointer">
                            {videoDetails?.videoOwner?.userFirstName} {videoDetails?.videoOwner?.userLastName}
                        </p>
                        <p className="text-xs text-gray-600">
                            {videoDetails?.videoComments?.length} comments
                        </p>
                    </div>
                </div>
                
                {/* Subscribe Button
                <button className="bg-red-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-red-700 transition duration-200">
                    SUBSCRIBE
                </button> */}
            </div>

            {/* Video Description - Collapsible section placeholder */}
            <p className="mt-4 text-sm whitespace-pre-line bg-gray-50 p-3 rounded-lg border border-gray-100">
                {videoDetails?.videoDescription}
            </p>
        </div>

        {/* Comments Section Placeholder */}
        <div className="mt-6">
            <CommentSection comments={videoDetails?.videoComments} />
        </div>

      </div>

      {/* Right Sidebar / Related Videos - YouTube's standard related videos column */}
      {/* Keeping w-1/4, which is appropriate for a related videos column */}
      <div className="w-1/4 bg-white p-4 space-y-3 overflow-y-auto border-l border-gray-100">
        <h2 className="font-bold text-lg mb-4 text-gray-900">Related</h2>
        
        {relatedVideos.map((video) => (
          <div
            key={video.id}
            className="cursor-pointer hover:bg-gray-100 p-2 rounded-lg flex space-x-3"
            onClick={() => setCurrentVideo(video.url)}
          >
            {/* Video Info */}
            <div className="flex flex-col">
              <p className="text-sm font-semibold text-gray-900 line-clamp-2">
                {video.title}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                {video.channel}
              </p>
              <p className="text-xs text-gray-500">
                200K views • 1 week ago
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
  )
}

export default WatchVideo