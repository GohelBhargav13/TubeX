// src/pages/HomePage.jsx
import React, { useEffect, useState } from "react";
import { useUserAuthStore } from "../store/auth.store.js";
import SideBar from "../component/SideBar.jsx";
import { getAllVideos } from "../API/video.api.js";
import toast from "react-hot-toast";
import VideoPlayer from "../component/VideoPlayer.jsx";
import { Heart, Loader2, MessageCircle, ThumbsUp } from "lucide-react";
import socket from "../Server/Server.js";
import { useNavigate } from "react-router-dom";

// const videos = [
//   {
//     title: "React Tutorial",
//     channel: "CodeWithBhargav",
//     views: "1.2M views",
//     thumbnail: "https://via.placeholder.com/320x180",
//   },
//   {
//     title: "Zustand in Hindi",
//     channel: "CodeWithBhargav",
//     views: "500K views",
//     thumbnail: "https://via.placeholder.com/320x180",
//   },
//   {
//     title: "Tailwind CSS Layout",
//     channel: "CodeWithBhargav",
//     views: "300K views",
//     thumbnail: "https://via.placeholder.com/320x180",
//   },
//   // add more video objects
// ];

export default function HomePage() {
  const userData = useUserAuthStore((state) => state.userData);

  const [videos, setVideos] = useState([]);
  const [fetchingVideos, setFetchingVideos] = useState(false);
  const [newCommentCount, setNewCommentCount] = useState(0);
  const [searchWords, setSearchWords] = useState("");
  const [searchedData, setSearchData] = useState([]);

  const naviagte = useNavigate();

  useEffect(() => {
    // fetch the all videos
    const fetchVideo = async () => {
      try {
        setFetchingVideos(true);

        const res = await getAllVideos();
        if (res?.data !== null) {
          setVideos(res?.data);
          setSearchData(res?.data);
          // toast.success(res.message || "Videos fetched successfully");
          return;
        } else {
          toast.error(res.message || "Videos Can't Fetched");
        }
      } catch (error) {
        setFetchingVideos(false);
        console.log("Error in fetching all videos : ", error);
      } finally {
        setFetchingVideos(false);
      }
    };
    fetchVideo();

    // Socket Listen
    socket.on(
      "VideoLikeUpdated",
      ({ LikeCounts, message, userId, videoId }) => {
        // console.log({  LikeCounts,message,userId,videoId })
        setVideos((prevvideos) =>
          prevvideos.map((video) =>
            video?._id === videoId
              ? { ...video, VideoLikes: LikeCounts }
              : video
          )
        );

        if(searchWords || searchWords === ""){
          setSearchData((prevvideos) =>
          prevvideos.map((video) =>
            video?._id === videoId
              ? { ...video, VideoLikes: LikeCounts }
              : video
          )
        );
        }
        if (userData?._id === userId && message) toast.success(message);
      }
    );

    // socket listen of the update comments
    socket.on(
      "VideoCommentUpdated",
      ({ New_Comment, commentCount, userId, videoId, message, commentId }) => {
        // update the comment count
        setVideos((prevVideos) =>
          prevVideos.map((video) =>
            video?._id === videoId
              ? { ...video, VideoCommentsLike: commentCount }
              : video
          )
        );

         if(searchWords || searchWords === ""){
           setSearchData((prevVideos) =>
            prevVideos.map((video) =>
            video?._id === videoId
              ? { ...video, VideoCommentsLike: commentCount }
              : video
          )
        );
        }
      }
    );

    socket.on(
      "VideoCommentDeleted",
      ({
        commentId,
        userId,
        videoID,
        message,
        success,
        r_comments,
        commentCounts,
      }) => {
        setNewCommentCount(commentCounts);
      }
    );

    socket.on("newVideoUploaded", ({ videoData }) => {
      console.log("Video Data is : ", { videoData });
      console.log("Video URL is : ", videoData?.data?.videoUrl);

      if (videoData) {
        toast.success(`New video Uploded : ${videoData?.data?.videoTitle}`);
        setVideos((prevVideos) => [videoData?.data, ...prevVideos]);

        if(searchWords || searchWords === ""){
            toast.success(`New video Uploded : ${videoData?.data?.videoTitle}`);
           setSearchData((prevVideos) => [videoData?.data, ...prevVideos]);
        }
        console.log(videos);
      }
    });

    // delete video and update UI
    socket.on("videoDeleted", ({ videoId, userData, message }) => {
      setVideos((prevVideos) => prevVideos.filter((v) => v?._id !== videoId));

      if(searchWords || searchWords === ""){
        setSearchData((prevVideos) => prevVideos.filter((v) => v?._id !== videoId));
      }
    });

    // listen update video details
    socket.on("videoDetailsUpdated", ({ videoId, updatedData, message }) => {
      console.log("video Data is with Updated Deatils : ", updatedData);
      console.log("Message from Server :", message);

      setVideos((prev) =>
        prev.map((v) => (v?._id === videoId ? { ...v, ...updatedData } : v))
      );

      if(searchWords || searchWords === ""){
        setSearchData((prev) =>
        prev.map((v) => (v?._id === videoId ? { ...v, ...updatedData } : v))
      );
      }
      if (message) toast.success(message, { duration: 4000 });
    });

    // listen Error from socket
    socket.on("ErrorInSocket", ({ message }) => {
      toast.error(message);
    });

    // unmounted sockets
    return () => {
      socket.off("VideoLikeUpdated");
      socket.off("VideoCommentUpdated");
      socket.off("VideoCommentDeleted");
      socket.off("newVideoUploaded");
      socket.off("videoDeleted");
      socket.off("videoDetailsUpdated");
      socket.off("ErrorInSocket");
    };
  }, []);

  // handle the like feature of the video
  const handleLike = (videoId, userId) => {
    // console.log({ videoId,userId })
    // console.log("Like Event Triggered")
    socket.emit("likePost", { videoId, userId });
  };

  // handle a Dynamic Search
  const handleSearch = () => {
    if (searchWords.trim()) {
      setSearchData(videos);
      setSearchData((prev) =>
        prev.filter((v) =>
          v?.videoTitle.toLowerCase().includes(searchWords.toLowerCase())
        )
      );
    } else {
      setSearchData(videos);
    }
  };

  if (fetchingVideos) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

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
      <div className="flex h-screen overflow-hidden bg-gray-100 font-mono">
        {/*  Side bar Component Import */}
        <SideBar />

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Video Grid */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Container for padding left/right */}
            <div className="max-w-[1400px] mx-auto">
              <h2 className="text-xl font-semibold mb-4">
                Learn New Things....
              </h2>

              {!fetchingVideos && searchedData?.length === 0 ? (
                <div className="text-gray-700 font-mono">No Video's Found...</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {searchedData?.length > 0 &&
                    searchedData?.map((video, idx) => (
                      <div
                        key={idx}
                        className="bg-white rounded-lg shadow hover:shadow-md transition p-2"
                      >
                        <div
                          className="relative cursor-pointer"
                          onClick={() => naviagte(`/watch/${video?._id}`)}
                        >
                          <VideoPlayer videoURL={video?.videoUrl} />

                          <div className="flex items-center mt-2">
                            <img
                              src={
                                video?.user_avatar ||
                                "https://via.placeholder.com/320x180"
                              }
                              alt="User"
                              className="w-10 h-10 rounded-full"
                            />
                            <h4 className="ml-2 font-medium text-gray-600">
                              {video?.videoOwner?.userFirstName}{" "}
                              {video?.videoOwner?.userLastName}
                            </h4>
                          </div>
                        </div>

                        <h3 className="mt-2 font-medium text-gray-800 flex justify-items-center">
                          {video?.videoTitle}
                        </h3>
                        <p className="text-sm mt-2 text-gray-500 flex justify-items-center">
                          {video?.videoDescription?.length > 35
                            ? video?.videoDescription?.slice(0, 35) + "..."
                            : video?.videoDescription + "..."}
                        </p>

                        <div className="flex flex-row gap-3 mt-2 justify-center items-center">
                          <button
                            className="text-sm text-gray-500 flex items-center cursor-pointer"
                            onClick={() =>
                              handleLike(video?._id, userData?._id)
                            }
                          >
                            <ThumbsUp className="mr-1" />{" "}
                            {typeof video?.VideoLikes === "number"
                              ? video?.VideoLikes
                              : video?.videoLikes?.length}
                          </button>
                          <p className="text-sm text-gray-500 flex items-center">
                            <MessageCircle className="mr-1" height={22} />{" "}
                            {newCommentCount ||
                              video?.VideoCommentsLike ||
                              video?.videoComments?.length}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
