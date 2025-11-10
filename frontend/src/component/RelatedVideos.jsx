import React, { useEffect, useState } from "react";
import { getAllVideos } from "../API/video.api.js";
import VideoPlayer from "./VideoPlayer.jsx";
import { useNavigate,useParams } from "react-router-dom"

const RelatedVideos = ({ videoId }) => {
  const [relatedVideos, setRelatedVideos] = useState([]);
  const navigate = useNavigate();
  // const { videoID } = useParams();

  useEffect(() => {
    const fetchAllVideos = async () => {
      const res = await getAllVideos();
      console.log("Data of the all videos : ", res);

      setRelatedVideos(res.data)

      // Now filter the realted Video
      setRelatedVideos((prevData) => prevData.filter((video) => video?._id !== videoId ) )
    };

    fetchAllVideos();   

  }, [videoId]);

  if(relatedVideos?.length === 0) {
    return (
      <div className="text-gray-700 font-mono">❌ No Videos are there</div>
    )
  }

  return (
    <>
         {relatedVideos.map((video) => (
          <div
            key={video?._id}
            className="cursor-pointer bg-slate-800 p-5 hover:scale-105 hover:bg-slate-950 hover:duration-500 hover:shadow-md hover:p-4  text-white rounded-lg flex space-x-3"
          >
            {/* Video Info */}
            <div className="flex flex-col">
                <div onClick={() => navigate(`/watch/${video?._id}`)}>
                <VideoPlayer videoURL={video?.videoUrl} height={150}/>
                
              <p className="text-sm font-semibold line-clamp-2">
                {video?.videoTitle}
              </p>
              <p className="text-xs text-neutral-400 mt-1">
                {video?.videoDescription}
              </p>
              <p className="text-xs text-gray-500">
                200K views • 1 week ago
              </p>
              </div>
            </div>
          </div>
        ))}
    </>
  );
};

export default RelatedVideos;
