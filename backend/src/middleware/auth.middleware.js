import jwt from "jsonwebtoken";
import  ApiError  from "../utills/api-error.js";

import Userm from "../models/user.models.js";

const IsLoggedIn = async(req, res, next) => {
  const token = req.cookies?.accesstoken;
  console.log(token)

  try {
    if (!token) {
      return res.status(401).json(new ApiError(401, "Please login"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);

    const user = await Userm.findById(decoded?.id).select("-password");

    if(!user){
      throw new ApiError(401,"Invalid Access token")
    }

     req.user = user;

    next();
  } catch (error) {
    if(error.name === "TokenExpiredError"){
         return res.status(401).json(new ApiError(401, "Token expired, please login again"));
    }
    res.status(500).json(new ApiError(500,"internal Error",error))
  }
};

export default IsLoggedIn;