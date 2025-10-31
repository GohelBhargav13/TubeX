import { api } from "../services/axios.js"

// fetch the user count and admin count
export const fetchUserAndAdminCounts = async () => {
    try {

       const res = await api.get("/user/get-user-count")
       console.log("Response of the user count get : ",  res?.data);

       if(res?.data?.StatusCode === 200){
            return { data: res?.data?.data, success:true }
       }else {
            return { data:null, success:false }
       }
        
    } catch (error) {
        console.log("Error while fetching a user count : ", error?.message)
        return;
    }
}

// fetch the video count 
export const fecthVideoCounts = async () => {
    try {

       const res = await api.get("/video/get-video-count")

       if(res?.data?.StatusCode === 200){
        return { videoCounts:res?.data?.data?.totalCount, success:true }
       }else {
            return { videoCounts: null, success:false }
       }
        
    } catch (error) {
        console.log("Error While Fetchig a videos Count : ", error)
        return;
    }
}
