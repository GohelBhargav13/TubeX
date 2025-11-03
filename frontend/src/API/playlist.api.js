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