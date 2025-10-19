import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [video, setVideo] = useState(null);
  const [finalmessage, setFinalMessage] = useState("");

  const handleVideoUpload = async () => {
    const formData = new FormData();

    formData.append("video", video);
    console.log(formData);

   try {
     const res = await axios.post(
       "http://localhost:4000/video/upload-videos",
       formData,
       {
         headers: {
           "Content-Type": "multipart/form-data",
         },
       }
     );
 
     console.log(res.data);
     if (res.data.success) {
       setFinalMessage(res.data.message);
       setVideo(null)
     } else {
       setFinalMessage(res.data.message || "video is not going to backend");
     }
   } catch (error) {
    console.log(error)
   }
  };

  return (
    <>
      {finalmessage && (
        <span style={{ color: "black", fontWeight: "bolder" }}>
          {finalmessage}
        </span>
      )}
      <input
        type="file"
        name="video"
        accept="video/*"
        onChange={(e) => setVideo(e.target.files[0])}
      />
      <button onClick={handleVideoUpload} disabled={!video} >CLick</button>
    </>
  );
}

export default App;
