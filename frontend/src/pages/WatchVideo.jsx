import React,{ useEffect, useState } from 'react'
import { getVideoById } from '../API/video.api.js'
import { useParams } from  "react-router-dom"
import toast from 'react-hot-toast'
import { MessageCircle,ThumbsUp,ThumbsUpIcon } from "lucide-react"
import SideBar from '../component/SideBar.jsx'
import { useUserAuthStore } from "../store/auth.store.js"
import VideoPlayer from '../component/VideoPlayer.jsx'
import CommentSection from '../component/CommentSection.jsx'
import socket from '../Server/Server.js'
import RelatedVideos from '../component/RelatedVideos.jsx'

const WatchVideo = () => {
    
    const [videoDetails, setVideoDetails] = useState({})
    const [newCommentCount, setNewCommentCount] = useState(0)

    const { videoId } = useParams();
     const { userData } = useUserAuthStore();

     console.log("Video Details : ",videoDetails)

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
                    // toast.success(res?.message || "Video Fetched Successfully")
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

        socket.on("VideoLikeUpdated",({ LikeCounts,message,userId,videoId:updatedId }) => {
            // console.log({  LikeCounts,message,userId,videoId })
           setVideoDetails((prevVideo) => prevVideo?._id === updatedId ? {...prevVideo, LikeCounts} : prevVideo )
           if(userData?._id === userId && message) toast.success(message || "Video Liked Successfully")
        })

        socket.on("VideoCommentUpdated", ({ New_Comment,commentCount,userId,videoId:updatedId,message }) => {
            setVideoDetails((prevVideo) => prevVideo?._id === updatedId  ? { ...prevVideo, CommentCounts:commentCount, videoComments: [...(prevVideo?.videoComments || []), New_Comment],} : prevVideo)
            setNewCommentCount(commentCount)
        })

        socket.on("deleteCommentUpdate", ({ commentId,userId,videoID,message, success,r_comments,commentCounts }) => {
            setNewCommentCount(commentCounts)
        })

        socket.on("ErrorInSocket", ({ message }) => toast.error(message))

       return () => {
        socket.off("VideoCommentUpdated")
        socket.off("ErrorInSocket")
        socket.off("VideoLikeUpdated")
       }

    },[videoId])

    const handleLikes = (videoId) => {
      socket.emit("likePost", { videoId,userId:userData?._id })
    }

  return (
    <div className='bg-gray-800'>
     {/* Header */}
        <div className="h-16 bg-gray-950 text-white border-b-2 border-b-white font-mono flex items-center justify-between px-6 shadow-sm mb-6">
          <h1 className="text-2xl font-bold text-white">TubeX</h1>
          <div className="flex items-center space-x-4">
            <p className="font-medium">
              {userData?.userFirstName} {userData?.userLastName}
            </p>
            <img
              src={
                userData?.user_avatar || "https://via.placeholder.com/320x180"
              }
              alt="User"
              className="w-10 h-10 rounded-full"
            />
          </div>
        </div>
   <div className="flex min-h-screen bg-gray-900 text-white border-t-2 border-t-white">
      {/* Left Sidebar - YouTube's main navigation */}
      {/* Keeping w-1/5 as per your original structure, though YouTube's is often narrower */}
        <SideBar />

      {/* Center Main Video and Details */}
      <div className="flex-1 p-6 overflow-y-auto flex flex-col max-w-[calc(100%-25%)]">
              
        {/* Video Player - Adjusted height for a more standard aspect ratio */}
        <div className="w-full mb-6 rounded-lg overflow-hidden shadow-lg">
          <VideoPlayer videoURL={videoDetails?.videoUrl} width="100%" height="550px"  config={ { youtube:{ playerVars: { autoplay: 1 } } } } />
        </div>
        
        {/* Video Metadata */}
        <div className="pb-4 border-b border-gray-200">
          <h1 className="font-bold text-2xl mb-2 font-mono">
            {videoDetails?.videoTitle}
          </h1>
          
          <div className="flex justify-between items-center text-sm">
            <div className='flex items-center space-x-4'>
                <p className="font-semibold">{videoDetails.views || 1} views</p>
                <span className="text-xs">•</span>
                <p>{videoDetails?.createdAt?.slice(0,10) || undefined}</p>
            </div>
            {/* Like/Dislike/Share Buttons Placeholder */}
            <div className='flex items-center space-x-5'>
                <button className='flex items-center gap-0.5 cursor-pointer space-x-1 hover:text-neutral-100 transition'
                onClick={() => handleLikes(videoDetails?._id,userData?._id)}
                >
                    <span className="text-xl"><ThumbsUp /></span>
                    <span className='font-medium'>{ videoDetails?.LikeCounts ?? videoDetails?.videoLikes?.length ?? 0}</span>
                </button>
                <button className='flex items-center gap-0.5 cursor-pointer space-x-1 hover:text-neutral-100 transition'>
                    <span className="text-xl"><MessageCircle /></span>
                    <span className='font-medium'>{ newCommentCount ?? videoDetails?.CommentCounts ?? videoDetails?.videoComments?.length ?? 0}</span>
                </button>
                {/* <button className='font-medium hover:text-red-600 transition'>SHARE</button> */}
            </div>
          </div>
        </div>

        {/* Channel Info and Description */}
        <div className="mt-4 pb-6 border-b border-gray-200">
            <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3 font-mono">
                    <img
                        src={videoDetails?.videoOwner?.user_avatar || "" }
                        alt={videoDetails?.videoOwner?.userFirstName}
                        className="w-12 h-12 rounded-full cursor-pointer"
                    />
                    <div>
                        <p className="font-bold text-md hover:text-neutral-100 cursor-pointer">
                            {videoDetails?.videoOwner?.userFirstName} {videoDetails?.videoOwner?.userLastName}
                        </p>
                        <p className="text-xs text-gray-600">
                            { newCommentCount ?? videoDetails?.CommentCounts ?? videoDetails?.videoComments?.length ?? 0} comments
                        </p>
                    </div>
                </div>
                
                {/* Subscribe Button
                <button className="bg-red-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-red-700 transition duration-200">
                    SUBSCRIBE
                </button> */}
            </div>

            {/* Video Description - Collapsible section placeholder */}
            <p className="mt-4 text-sm whitespace-pre-line bg-slate-700 p-3 rounded-lg border border-gray-100 font-mono text-white">
                {videoDetails?.videoDescription}
            </p>
        </div>

        {/* Comments Section Placeholder */}
        <div className="mt-6 font-mono text-center">
            <CommentSection comments={videoDetails?.videoComments} userInfo={userData} videoId={videoId} />
        </div>

      </div>

      {/* Right Sidebar / Related Videos - YouTube's standard related videos column */}
      {/* Keeping w-1/4, which is appropriate for a related videos column */}
      <div className="w-1/4 bg-gray-900 p-4 space-y-3 overflow-y-auto border-l-2 border-white flex-col justify-items-center">
        <h2 className="font-bold text-lg mb-4">Related Videos</h2>
        
        <RelatedVideos videoId={videoId} />
      
      </div>
    </div>
    </div>
  )
}

export default WatchVideo