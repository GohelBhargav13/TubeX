import { api } from "../services/axios.js"

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
