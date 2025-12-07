import { api } from "../services/axios.js"
import socket from "../Server/Server.js";

// fetch all videos
export const getAllVideos = async() => {
    const res = await api.get("video/get-videos");
    console.log(res.data.data)

    if(res.data.StatusCode === 200 || res.data.StatusCode === 201){
        return { data: res.data.data, message:res.data.message, success:res.data.success }  
    }else {
        return { data:null,message:res.data.Message|| "Videos Can't Fetched", success:res.data.success }
    }
}

// fetch video by ID for the single video page
export const getVideoById = async(videoId) => {
    try {

        const res = await api.get(`/video/get-video/${videoId}`);
        console.log("Video Fetch by ID :",res.data.data);

        if(res.data.StatusCode === 200 || res.data.StatusCode === 201){
            return { data: res.data.data.video, message:res.data.message, success:res.data.success }
        }else{
            return { data:null, message:"Video is Not Found",success:false }
        }

        
    } catch (error) {
        console.log("Error while fetching a data by ID : ",error);
        return null
    }
}

// User Liked Videos
export const userLikedVideos = async () => {
    try {

        const res = await api.get("/user/get-liked-videos");

        // check the statusCode is 200 or not
        if(res.data.StatusCode === 200 || res.data.StatusCode === 201){
            return { data:res.data.data, message:res.data.message, success:res.data.success }            
        }else if(res?.data?.StatusCode === 404){
            return res.data
        }else {
            return { data:null, message:res?.data?.Message, success:res?.data?.success }
        }
        
    } catch (error) {
        console.log("Error while fetching user liked videos of User : ",error);
        return
    }
}

// Fetch users Videos they upload on portal
export const userVideos = async() => {
    try {

       const res = await api.get("/user/user-videos")
       console.log("User Videos data is : ",res.data.data);

       if(res?.data?.StatusCode === 200 || res?.data?.StatusCode === 201){
            return { data:res.data.data, message:res.data.message, success:res.data.success }        
       }else {
        return { data:null, message:res.data.Message, success:res.data.success }
       }
        
    } catch (error) {
         console.log("Error while fetching user videos of User : ",error);
    }
}

// video upload api function
export const upoadVideo = async (formData) => {
  if(!formData) console.log("Data is not available")
  try {
     const res = await api.post("/video/upload-videos", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log(res.data)
    return res.data;
  } catch (error) {
    console.log("Error uploading video:", error);
    return null;
  }
};


// User Register api function
export const userRegister = async (formData) => {
    try {

       if(!formData) return;

       console.log(formData)

       const res = await api.post("/user/register",formData)

        console.log("Data response:",res.data)

        if(res?.data?.StatusCode === 400){
            return { StatusCode:400,data:null, message:res?.data?.Message || "User is already Exist Please Try With New Id", success:false }
        }

        if(res?.data?.StatusCode === 201){
            return { data:res.data.data, message:res.data.message, success:res?.data?.success,StatusCode:res?.data?.StatusCode }
        }else{
            console.log(res?.data)
            return { data:null, message:res.data.Message || "User Can't Register", success:res.data.success || false }
        }
        
    } catch (error) {
        console.log("Error while user Register : ",error);
    }
}

// update a video details { Title,description }
export const updateVideo = async (videoId,formdata) => {
    try {

        if(!videoId){
            return { StatusCode:404, message:"VideoId is not found", data:null }
        }

       const res = await api.post(`/video/update-video/${videoId}`,formdata)
       if(res?.data?.StatusCode === 200 || res?.data?.StatusCode === 201) {
            console.log("Updated video details : ",  res?.data?.data)
              console.log("Soscket is emitting....")

             socket.emit("videoDetailsUpdate", { videoId, updatedData:res?.data?.data  })
            return { StatusCode:res?.data?.StatusCode, data:res?.data?.data, success:res?.data?.success, message:"video Deatils Updated" }
       }else {
         return { StatusCode: res?.data?.StatusCode, data:null, success:res?.data?.success || false } 
       }
    
    } catch (error) {
            console.log("Error while updating video details : ", error);
            return { StatusCode:500, data:null, success:false }    
    }
}

// delete a video details
export const deleteVideo = async (videoId) => {
    try {

        // check if videoID is not found
        if(!videoId){
            return { StatusCode:404,message:"Video Id is not found", data:null }
        }

       const res = await api.delete(`/video/delete-video/${videoId}`);   
       if(res?.data?.StatusCode === 200 || res?.data?.StatusCode === 201) {
            console.log("Deleted video details : ",  res?.data?.data)
            return { StatusCode:res?.data?.StatusCode, data:res?.data?.data, success:res?.data?.success }
       }else {
         return { StatusCode: res?.data?.StatusCode, data:null, success:res?.data?.success || false } 
       }

    } catch (error) {
        console.log("Error while deleting Data : ",error);
        return;        
    }
}

// fetch the all recent videos and users
export const fetchUsersAndVideos = async () => {
    try {

       const result = await api.get("/video/get-recents")

       if(result?.data?.StatusCode === 200){
            return { userData: result?.data?.data?.users, videoData: result?.data?.data?.videos, success:true, Status:"good"  }
       }else {
            return { userData:null, videoData:null, success:false, Status:"fail" }
       }
        
    } catch (error) {
            console.log("Error While fetching the users and videos data : ", error)
            return;
    }
}
