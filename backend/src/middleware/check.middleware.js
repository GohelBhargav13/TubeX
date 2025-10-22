import Userm from "../models/user.models.js"
import ApiError from "../utills/api-error.js"

export const checkUserRole = (availableRoles = []) => {
    return async (req,res,next) => {
        const { id,role } = req.user

        const userRole = await Userm.findById(id).select("userRole")
        console.log(userRole);

        // check if the user role is defined or not
        if(!userRole){
            return res.status(403).json(new ApiError(403,"Your role is not defined"))
        }

        // check if the user roles are availble or not
        if(!availableRoles.includes(role)){
            return res.status(403).json(new ApiError(403,"You not have permission to access this route"))
        }
        next()
    }
}