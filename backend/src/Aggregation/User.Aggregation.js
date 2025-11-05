import Userm from "../models/user.models.js";
import Video from "../models/video.models.js";
import ApiError from "../utills/api-error.js";
import ApiResponse from "../utills/api-response.js";
import Redis from "ioredis";

// initialize redis for the caching
const redis = new Redis({ host:'localhost', port:6379 });

// Fetch user counts
export const UserCount = async (req, res) => {
  const UserCount = "user-count";
  const AdminCount = "admin-count";

  try {
    const checkIfexistUser = await redis.get(UserCount);
    const checkIfexistAdmin = await redis.get(AdminCount);

    if(checkIfexistUser && checkIfexistAdmin){
        console.log("User and Admin count is here : ", { checkIfexistAdmin, checkIfexistUser })
        return res.status(200).json(new ApiResponse(200, { user:checkIfexistUser,admin:checkIfexistAdmin }, "User-Admin is fetched"))
    }

    const UserC = await Userm.countDocuments({ userRole: "user" });
    const AdminC = await Userm.countDocuments({ userRole: "admin" });

    // set UserCount in the redis
    await redis.set(UserCount, UserC);
    await redis.set(AdminCount, AdminC);

    // Set Expire Time on the both
    await redis.expire(UserCount, 3600);
    await redis.expire(AdminCount, 3600);

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { user: UserC, admin: AdminC },
          "User Count Fetched Successfully 1"
        )
      );
  } catch (error) {
    console.log("Error While Count the User Count", error);
  }
};

// Fetch video counts
export const VideoCount = async (req, res) => {
  try {
    const result = await Video.aggregate([
      {
        $count: "TotalVideos",
      },
    ]);

    console.log("Video counts response is : ", result);
    const totalCount = result[0]?.TotalVideos;

    res
      .status(200)
      .json(new ApiResponse(200, { totalCount }, "Video Count is fetched"));
  } catch (error) {
    res
      .status(500)
      .json(new ApiError(500, "Internal Error in fetch video count", error));
    return;
  }
};
