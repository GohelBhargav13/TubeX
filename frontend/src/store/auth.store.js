import { create } from "zustand";
import { api } from "../services/axios.js";
import { toast } from "react-hot-toast";

export const useUserAuthStore = create((set,get) => ({
  userData: null,
  isFetching: false,
  isChecked:false,

  // Login Module 
  userLogin: async (formData) => {

    const { setUserData } = get()

    try {
        set({ isFetching: true })

        if(get().userData){
          console.log("User is Already logged In")
          set({ isChecked: true })
          return { status:true };
        }

        // Make a login request to the backend
       const res = await api.post("/user/login", formData,{ withCredentials:true })
       console.log(res?.data)

       const message = res?.data?.Message;
       const StatusCode = res?.data?.StatusCode;

       if(StatusCode === 200 || StatusCode === 201){
          console.log("User data is set.....");
          await setUserData()
          toast.success("Login Successful")
          return { status:true };
       }
      
       if(StatusCode === 404){
        toast.error(message || "Something is not found")
        return { status:false };
       }

       if(StatusCode === 401){
          toast.error(message || "Something Error from backend error")
          return { status:false };
       }

      
    } catch (error) {
        set({ userData:null })
        console.log("Error While login the user")
        toast.error(error?.response?.data?.message || "Login failed due to server error");
        return { status: false };
  
    }finally {
      set({ isFetching:false })
    }
  },

  // User Data Fetch
  setUserData: async () => {
    try {
      set({ isFetching: true });

      // check if the user data is already exist than return
      if(get().userData) {
        set({ isChecked:true })
        return;
      }

      const res = await api.get("/user/me");

      const StatusCode = res?.data?.StatusCode;
      const message = res?.data?.Message;

      if(StatusCode === 401){
          toast.error(message || "Please Fill the fields")
          return;
      }

        // Safe access + toast
      if(StatusCode === 200 || StatusCode === 201){
         const user = res?.data?.data || null;      
         set({ userData: user,isChecked:true });

          if (user !== null) {
              console.log("User Data is already Fetched....")
          } else {
            toast.error("Failed to fetch user data");
          }

      }
    } catch (error) {
      console.error("Error in fetching user data:", error);
        set({ userData: null ,isChecked:true});
        // toast.error("Error fetching user data");
    } finally {
      set({ isFetching: false });
    }
  },

  // User LogOut
  userLogout: async () => {
    try {

      set({ isFetching : true })

      const res = await api.get("/user/logout")
      if(res.data.StatusCode === 200 || res.data.StatusCode === 201){
          toast.success(res.data.message || "Logout successful");
          set({ userData : null})
      }else {
        toast.error(res.data.message || "Logout failed");
      }
      
    } catch (error) {
      set({ isFetching : false })
      set({ userData: null })
    }finally {
      set({ isFetching : false })
    }
  }

}));
