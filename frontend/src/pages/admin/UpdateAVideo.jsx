import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getVideoById, updateVideo } from "../../API/video.api";
import VideoPlayer from "../../component/VideoPlayer";
import { Loader2 } from "lucide-react";
import socket from "../../Server/Server";
import toast from "react-hot-toast";

const UpdateAVideo = ({ userData }) => {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const [videoDetails, setVideoDetails] = useState({
    videoTitle:"",
    videoDescription:"",
  });
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    const getVideoByID = async (videoId) => {
      setFetching(true);
      try {
        if (!videoId) return;
        const res = await getVideoById(videoId);

        if (res?.data !== null && res?.data !== undefined) {
          setVideoDetails(res?.data);
        } else {
          setVideoDetails({});
        }
      } catch (error) {
        setFetching(false);
        console.log("Error while fetching video by ID : ", error);
      } finally {
        setFetching(false);
      }
    };

    getVideoByID(videoId);
  }, []);

  //Handle Reset Function of the update form
  const handleReset = (e) => {
    // e.preventDefault();
    // e.stopPropagation();

    setVideoDetails({
      videoTitle:videoDetails?.videoTitle,
      videoDescription:videoDetails?.videoDescription
    })
  }

  // Handle Cancle Function of the update form
  const handleCancle = (e) => {
    e.preventDefault();
    navigate("/admin/video-update");
  }

  //Handle Changes Function of the update form
  const handleChanges = async(e) => {
    e.preventDefault();

    try {
      //make a form data 

      const formdata = new FormData();
      formdata.append("videoTitle",videoDetails?.videoTitle);
      formdata.append("videoDescription",videoDetails?.videoDescription)

     const res = await updateVideo(videoId,formdata)
     console.log(res?.data)
     toast.success(res?.message)

    } catch (error) {
      console.log("Error while updating a Video Data : ",error)
    }
    
  }

  return (
    <>
      {/* Header */}
      <div className="h-16 bg-white flex items-center justify-between px-6 shadow-sm font-mono sticky top-0 z-50">
        <h1 className="text-2xl font-bold text-blue-600">TubeX</h1>
        <div className="flex items-center space-x-4">
          <button
            className="cursor-pointer bg-gray-500 p-1.5 text-white rounded-md hover:bg-gray-700 transition duration-300 ease-in-out"
            onClick={() => navigate("/admin/video-update")}
          >
           ⬅️ Back
          </button>
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

      {fetching ? (
       <div className="flex justify-center items-center">
        <Loader2 className="animate-spin" />
       </div>
      ) : (
        <div className="flex flex-col md:flex-row p-6 space-y-6 md:space-y-0 md:space-x-6">
          {/* Left Section: Video Preview */}
          <div className="md:w-1/2">
            <h2 className="text-xl font-bold mb-4">Current Video Preview</h2>
            <div className="rounded-lg overflow-hidden shadow-lg mb-4">
              <VideoPlayer
                videoURL={videoDetails?.videoUrl}
                width="100%"
                height="350px"
              />
            </div>

            <div className="text-gray-600 text-sm flex flex-row gap-3 justify-center">
              <p>
                <strong>Views:</strong> {videoDetails.views || 0}
              </p>
              <p>
                <strong>Uploaded:</strong>{" "}
                {videoDetails?.createdAt?.slice(0, 10)}
              </p>
              <p>
                <strong>Likes:</strong> {videoDetails?.videoLikes?.length ?? 0}
              </p>
            </div>
          </div>

          {/* Right Section: Edit Form */}
          <div className="md:w-1/2 bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-bold mb-4 text-gray-950">
              Edit Video Details
            </h2>

            <form className="space-y-4" onSubmit={handleChanges}>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Video Title
                </label>
                <input
                  type="text"
                  value={videoDetails?.videoTitle || ""}
                  onChange={(e) =>
                    setVideoDetails({
                      ...videoDetails,
                      videoTitle: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  rows="5"
                  value={videoDetails?.videoDescription || ""}
                  onChange={(e) =>
                    setVideoDetails({
                      ...videoDetails,
                      videoDescription: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>

                          {/* <div>
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <select
                      value={videoDetails?.category || ""}
                      onChange={(e) => setVideoDetails({...videoDetails, category: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Category</option>
                      <option value="Education">Education</option>
                      <option value="Entertainment">Entertainment</option>
                      <option value="Technology">Technology</option>
                      <option value="Sports">Sports</option>
                    </select>
                  </div> */}

                          {/* <div>
                    <label className="block text-sm font-medium mb-1">Thumbnail</label>
                    <input
                      type="file"
                      accept="image/*"
                      className="w-full border border-gray-300 rounded-lg p-2"
                    />
                  </div> */}

              <div className="pt-4 flex flex-row gap-5">
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer"
                >
                  ✅ Save Changes
                </button>
                <button
                  type="submit"
                  className="w-full bg-gray-400 text-white py-2 rounded-lg hover:bg-gray-700 transition cursor-pointer"
                  onClick={handleReset}
                >
                  🔄️ Reset
                </button>
                <button
                  type="submit"
                  className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition cursor-pointer"
                  onClick={handleCancle}
                >
                  ❌ cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default UpdateAVideo;
