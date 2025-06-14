import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import AsyncHandler from "../utils/AsyncHandler.js";
import jwt from 'jsonwebtoken'
import BlacklistedToken from "../models/blackListedToken.model.js";

export const verifyJWT = AsyncHandler(async (req, res, next) => {

    const token = req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "")
    if (!token) {
        throw new ApiError(400, "Unauthorized request")
    }
    
    const isBlacklistedToken = await BlacklistedToken.findOne({token: token})
    if(isBlacklistedToken){
        throw new ApiError(400,"Token has been blacklisted")
    }    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);        
        const user = await User.findById(decoded?._id)

        if (!user) {
            throw new ApiError(401, "Invalid token");
        }

        req.user = user;

        return next();  
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            throw new ApiError(401, "Token expired");
        }
        throw new ApiError(401, "Invalid token");
    }
})
