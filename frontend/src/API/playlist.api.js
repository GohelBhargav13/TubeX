import toast from "react-hot-toast"
import { api } from "../services/axios"

// Get User's playLists
export const getAllUserPlayList = async () => {
    try {

       const result = await api.get("/playlist/get-playlists")
       if(result?.data?.StatusCode === 200){
            return { data:result?.data?.data?.userPlaylists, message:result?.data?.message, success:true }
       }else {
            return { data:[], message:"No PlayList Here", success:false }
       }
        
    } catch (error) {
        console.log("There is the error in fetching a users PlayList : ", error)
        return;
    }
}

// Add Videos In PlayList
export const addVideoInPlayList = async (videoId,playListId) => {
    try {
        
        if(!videoId) return

       const res = await api.post(`/playlist/add-videos/${videoId}/${playListId}`)

       if(res?.data?.StatusCode === 200){
            return { data: res?.data?.data, success:true, message:res?.data?.message }
       }else {
            return { data:null, success:false, message: "There is some issues to add the video" }
       }

    } catch (error) {
        console.log("There is the error to add the videos in the playList")
    }
}

// Fetch User's PlayLists
export const FetchUserPlayLists = async () => {
    try {
       const result = await api.get("/playlist/get-playlists")

       if(result?.data?.StatusCode === 404){
            return { data:[], StatusCode:404, success:false, message:"Zero PlayList Here...." }
       }

       if(result?.data?.StatusCode === 200){
            return { data:result?.data?.data, success:true, message:result?.data?.message }
       }else {
            return { data:[], success:false, message:result?.data?.Message }
       }
    } catch (error) {
        console.log("Error While fetching a playList Data : ", error)
        return;
    }
}

// check the video id is exist or not 
export const checkVideoId = async (videos = [],videoId) => {
    try {

        if(videos.length === 0 || !videoId){
            console.log("videos and id is required");
            return;
        }

       return videos.filter((v) => {
           return v?._id === videoId ? true : false
        })

    } catch (error) {
        console.log("Error While check the is the video is added in playlist or not")
        return;
    }
}

// delete playLists 
export const deletePlayList = async (playlistId) => {
    try {
       const result = await api.delete(`/playlist/delete-playlist/${playlistId}`)
        // userPlayLists = userPlayLists.filter((plId) => plId !== playlistId)

        if(result?.data?.StatusCode === 404){
            toast.error(result?.data?.Message || "PlayList Not Found")
        }

       if(result?.data?.StatusCode === 200){
            return { data:res?.data?.data, message:result?.data?.message, success:true }  
       }else {
            return { data:null, message:result?.data?.Message, success:false }
       }
        
    } catch (error) {
        console.log("Error While Deleting playList")
        return;
    }
}