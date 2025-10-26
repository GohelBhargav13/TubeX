import React, { useState } from "react";
import SideBar from "../component/SideBar";
import { upoadVideo } from "../API/video.api";
import toast from "react-hot-toast";

const VideoUploadPage = ({ userData }) => {

    // State for the video
    const [title,setTitle] = useState("")
    const [desc,setDesc] = useState("")
    const [video,setVideo] = useState(null)

    // handle the form data for the video upload
    const handleForm = async (e) => {
        e.preventDefault();

        const formdata = new FormData()
        formdata.append("videoTitle",title)
        formdata.append("videoDescription",desc)
        formdata.append("video",video)

       const res = await upoadVideo(formdata);

       if(res?.StatusCode === 404){
            toast.error(res.message || "Video Details is not found");
            return;
       }
       
       if(res?.data !== null){
            console.log(res?.data);

            toast.success(res.message || "Video Uploaded Successfully");
            return;
       }else {
            toast.error(res.message || "Video Can't Uploaded");
            return;
       }

    }

  return (
    <>
     {/* Header */}
        <div className="h-16 bg-white flex items-center justify-between px-6 shadow-sm mb-6">
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
      <div className="flex gap-6">
      <SideBar />
      <div className="max-w-2xl bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Upload New Video</h2>
        <form  onSubmit={handleForm}  className="space-y-4">
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
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            disabled={!title || !desc || !video}
          >
            Upload
          </button>
        </form>
      </div>
      </div>
    </>
  );
};

export default VideoUploadPage;
