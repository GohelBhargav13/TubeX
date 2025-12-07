import React, { useState } from "react";
import SideBar from "../../component/SideBar.jsx";
import { upoadVideo } from "../../API/video.api.js";
import toast from "react-hot-toast";
import UserAvatar from "../../component/UserAvatar.jsx";


const VideoUploadPage = ({ userData }) => {
  // State for the video
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [video, setVideo] = useState(null);
  const [videoUpload, setVideoUpload] = useState(false);

  // handle the form data for the video upload
  const handleForm = async (e) => {
  e.preventDefault();
  console.log("Video Upload initiated...");

  try {
    setVideoUpload(true);

    const formData = new FormData();
    formData.append("videoTitle", title);
    formData.append("videoDescription", desc);
    formData.append("video", video); 

    const res = await upoadVideo(formData); // send formdata
    console.log(res)
    if (res?.StatusCode === 404) {
      toast.error(res.message || "Video details are missing");
      return;
    }

    if (res?.data !== null && (res?.StatusCode === 200 || res?.StatusCode === 201)) {
      toast.success(res?.data?.message || "Video Uploaded Successfully");
      return;
    } else {
      toast.error(res?.Message || "Video Upload Failed");
    }
  } catch (error) {
    console.error("Error in video uploading:", error);
    toast.error("Something went wrong while uploading the video");
  } finally {
    setVideoUpload(false);
    setTitle("");
    setDesc("");
    setVideo(null);
  }
};

  return (
    <>
      {/* Header */}
      <div className="h-16 bg-gray-950 text-white flex items-center justify-between px-6 shadow-sm border-b-2 border-b-white font-mono">
        <h1 className="text-2xl font-bold">TubeX</h1>
        <div className="flex items-center space-x-4">
          <p className="font-medium">
            {userData?.userFirstName} {userData?.userLastName}
          </p>
            <UserAvatar username={userData?.userFirstName} />
        </div>
      </div>
      <div className="flex gap-6 font-mono min-h-screen bg-linear-to-b from-gray-800 to-black">
        <SideBar />
        <div className="bg-slate-500 text-slate-950 font-bold p-6 rounded-2xl shadow-lg w-fit h-fit justify-center mt-12">
          <h2 className="text-xl font-semibold mb-4">Upload New Video</h2>
          <form onSubmit={handleForm} className="space-y-4">
            <input
              type="file"
              name="video"
              accept="video/*"
              className="border p-2 w-full roundxed"
              onChange={(e) => setVideo(e.target.files[0])}
              required
            />
            <input
              type="text"
              name="title"
              placeholder="Video Title"
              className="border p-2 w-full rounded"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <textarea
              name="description"
              placeholder="Description"
              className="border p-2 w-full rounded"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              required
            />
            <button
              type="submit"
              className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 ${videoUpload ? `opacity-50 cursor-not-allowed` : `cursor-pointer` }`}
              disabled={!title || !desc || !video || videoUpload}
            >
            { videoUpload ? "Uploading..." : "Upload" }
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default VideoUploadPage;
