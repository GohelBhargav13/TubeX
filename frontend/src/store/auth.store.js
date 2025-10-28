import { create } from "zustand";
import { api } from "../services/axios.js";
import { toast } from "react-hot-toast";

export const useUserAuthStore = create((set) => ({
  userData: null,
  isFetching: false,
  isChecked:false,

  setUserData: async () => {
    try {
      set({ isFetching: true });

      const res = await api.get("/user/me");

      // Safe access + toast
      const user = res?.data?.data || null;
      // console.log(user);
      
      set({ userData: user,isChecked:true });

      if (user) {
        // return toast.success(res?.data?.message || "Data fetched successfully");
          console.log("User Data is already Fetched....")
      } else {
        toast.error("Failed to fetch user data");
      }

    } catch (error) {
      console.error("Error in fetching user data:", error);
      set({ userData: null ,isChecked:true});
      toast.error("Error fetching user data");

    } finally {
      set({ isFetching: false });
    }
  },

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
