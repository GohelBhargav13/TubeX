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

        const res = await api.get(`/user/verify-email/${verifyURL}`)
        console.log("response userdata is : ", res?.data)
        if(res?.data?.StatusCode === 400){
            return { StatusCode:res?.data?.StatusCode, message:"Not Verified", success:false }
        }

        if(res?.data?.StatusCode === 200){
            return { StatusCode:res?.data?.StatusCode, message:res?.data?.data?.message, success:true, userData:res?.data?.data?.userData }
        }
        
    } catch (error) {
        console.log("Error while user email verification:", error?.message)
        return;
    }
}

// delete user profile 
export const UserDeleteProfile = async (userId) => {

    if(!userId) return

    try {

       const res = await api.delete(`/user/delete-user/${userId}`)
       const full_response = res?.data

       console.log("Delete User Response : ",full_response?.data)

       if(full_response?.StatusCode === 403){
            return { StatusCode:403,data:null,message:full_response?.Message || "You're not accessing this route" }
       }

       if(full_response?.StatusCode === 404){
            return { StatusCode:404,data:null,message:full_response?.Message || "User Not Found" }
       }

       if(full_response?.StatusCode === 200){
            return { StatusCode:200,data:full_response?.data, message:full_response?.message, success:full_response?.success }
       }
        
    } catch (error) {
        console.log("Error while deleting the user")
        return;
    }
}