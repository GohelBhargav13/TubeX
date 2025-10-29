import { useEffect, useState } from "react";
import { deleteVideo, getAllVideos, updateVideo } from "../../API/video.api";
import SideBar from "../../component/SideBar";
import VideoPlayer from "../../component/VideoPlayer";
import { Loader2, MessageCircle, Pen, ThumbsUp, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom"
import socket from "../../Server/Server.js";
import toast from "react-hot-toast";

const VideoUpdatePage = ({ userData }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Data fetch on page load
  useEffect(() => {
    // fetch the All videos
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const res = await getAllVideos();

        if (res?.data !== null) {
          console.log("Data is not null");
          setVideos(res?.data);
          return;
        } else {
          setVideos([]);
        }
      } catch (error) {
        setLoading(false);
        console.log("Error while fetch data from the api");
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();

    // listen the videodeleted
    socket.on("videoDeleted", ({ videoId,userData,message }) => {
      setVideos((prev) => prev.filter((v) => v?._id !== videoId))
      if(userData?._id === userData?._id && message){
          toast.success(message)
      }
    })

    // listen the error from socket
    socket.on("ErrorInSocket", ({ message }) => {
        if(message) toast.error(message)
    })

    // unmount sockets
    return () => {
      socket.off("videoDeleted");
      socket.off("ErrorInSocket")
    }

  }, []);

  // Handle Update Video
  const handleUpdateVideo = (videoId) => {
    console.log("handle updte function clicked.....");
    navigate(`/admin/update-video/${videoId}`, { state: { userData } })
    return;
  };

  // Handle Remove Video
  const handleDeleteVideo = async(videoId) => {
    console.log("handle delete function clicked..... ")
  
    // Socket is emitting for the video delete
    socket.emit("deleteVideo", { videoId,userData })
  }

  // Handle Like Video
//   const handleLikeVideo = (videoId) => {
//     console.log("handle like function clicked.....")
//   }


  // check is fecthing than loader
  if (loading) {
    return (
      <div className="flex justify-center items-center text-blue-500">
        <Loader2 className="animate-spin" />
      </div>
    );
  } else {
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
              src={
                userData?.user_avatar || "https://via.placeholder.com/320x180"
              }
              alt="User"
              className="w-10 h-10 rounded-full"
            />
          </div>
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
                <h2 className="text-xl font-semibold mb-4">Update Panel</h2>

                {/* Grid container */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-35 w-[900px]">
                
                  {videos.map((video, idx) => (
                    <>
                    <div
                      key={idx}
                      className="bg-white rounded-lg shadow hover:shadow-md transition p-2 w-[330px]"
                    >
                     <div className="flex justify-end cursor-pointer pt-1 gap-2">
                        <div className="hover:text-gray-600" onClick={() => handleUpdateVideo(video?._id)} ><Pen /></div>
                        <div className=" hover:text-gray-600" onClick={() => handleDeleteVideo(video?._id)} > <Trash2 />  </div>
                     </div>
                      <div
                        className="relative cursor-pointer"
                        onClick={() => navigate(`/watch/${video?._id}`)}
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

                      <h3 className="mt-2 font-medium text-gray-800 flex justify-items-start">
                        {video?.videoTitle}
                      </h3>
                      <p className="text-sm text-gray-500 flex justify-items-center">
                        {video?.videoDescription?.length > 35
                          ? video?.videoDescription?.slice(0, 35) + "..."
                          : video?.videoDescription + "..."}
                      </p>

                      <div className="flex flex-row gap-3 mt-2 justify-center items-center">
                        <button
                          className="text-sm text-gray-500 flex items-center cursor-pointer"
                          onClick={() => handleLike(video?._id, userData?._id)}
                        >
                          <ThumbsUp className="mr-1" />{" "}
                          {typeof video?.VideoLikes === "number"
                            ? video?.VideoLikes
                            : video?.videoLikes?.length}
                        </button>
                        <p className="text-sm text-gray-500 flex items-center">
                          <MessageCircle className="mr-1" height={22} />{" "}
                          {video?.VideoCommentsLike ??
                            video?.videoComments?.length}
                        </p>
                      </div>
                    </div>  
                    </>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
};

export default VideoUpdatePage;
