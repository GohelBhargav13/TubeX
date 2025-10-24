import { create } from "zustand";
import { api } from "../services/axios.js";
import { toast } from "react-hot-toast";

export const useUserAuthStore = create((set) => ({
  userData: null,
  isFetching: false,

  setUserData: async () => {
    try {
      set({ isFetching: true });

      const res = await api.get("/user/me");

      // Safe access + toast
      const user = res?.data?.data || null;
      console.log(user);
      
      set({ userData: user });

      if (user) {
        return toast.success(res?.data?.message || "Data fetched successfully");
      } else {
        toast.error("Failed to fetch user data");
      }

    } catch (error) {
      console.error("Error in fetching user data:", error);
      set({ userData: null });
      toast.error("Error fetching user data");

    } finally {
      set({ isFetching: false });
    }
  },
}));
