import Userm from "../models/user.models.js"
import ApiError from "../utills/api-error.js"

// checking the user role
export const checkUserRole = (availableRoles = []) => {
    return async (req,res,next) => {
        const { id,userRole:role } = req.user

        console.log("User Roles is : ",role);

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