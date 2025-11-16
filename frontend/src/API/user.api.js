import { api } from "../services/axios.js"

// Fetch All Users
export  const fetchAllUsers = async () => {
    try {

        const res = await api.get("/user/all-users");

        if(res?.data?.StatusCode === 200) {
            console.log("User Details is : ", res?.data?.data)
            return { data:res?.data?.data, success:true  }
        }else {
            return { data:null, success:false }
        }
        
    } catch (error) {
        console.log("Error While Fetching a User Data : ", error);
        return;
    }
}

// Change UserRole from the Backend
export const changeUsersRole = async (userId,userRole) => {
    try {
        console.log("UserID in API : ", userId)
        console.log("UserRole in API : ", userRole)
        if(!userId) return;

        const data = {
            userRole:userRole
        }

       const res = await api.post(`/user/change-userRole/${userId}`,data);
       console.log("Response after change a UserRole Backend: ", res?.data)

       if(res?.data?.StatusCode === 200){
            console.log("User role Changed : ", res?.data?.data)
            return { data:res?.data?.data, success:true, updatedRole:res?.data?.UpdatedRole, message:res?.data?.message }
       }else {
        return { data:null, success:false,message:"user Role is not updated" }
       }
        
    } catch (error) {
        console.log("Error while change the user Role : ", error);
        return;
    }
}

// user varification
export const UserEmailVerification = async (verifyURL) => {
    try {

        if(!verifyURL) return;

        const res = await api.get(`https://tubex-m576.onrender.com/api/v1/user/verify-email/${verifyURL}`)
        
        if(res?.data?.StatusCode === 400){
            return { StatusCode:res?.data?.StatusCode, message:"Not Verified", success:false }
        }

        if(res?.data?.StatusCode === 200){
            return { StatusCode:res?.data?.StatusCode, message:res?.data?.data?.message, success:true }
        }
        
    } catch (error) {
        console.log("Error while user email verification:", error?.message)
        return;
    }
}