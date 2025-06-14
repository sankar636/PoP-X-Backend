import AsyncHandler from "../utils/AsyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from '../utils/ApiResponse.js'
import User from '../models/user.model.js'
import { validationResult } from 'express-validator'
import { createUser } from '../services/user.service.js';
import BlacklistedToken from "../models/blackListedToken.model.js";

const registerUser = AsyncHandler(async (req, res) => {
    // console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(new ApiError(400, "Validation errors", errors.array()));
    }

    const { name, phone, email, password, company, isAgency } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(409).json(new ApiError(409, "User with this email already exists"));
    }

    const user = await createUser({
        name,
        phone,
        email,
        password,
        company,
        isAgency
    });

    const token = await user.generateAuthToken();
    return res.status(200).json(
        new ApiResponse(200, "User Registered Successfully", { user, token })
    );
});

const loginUser = AsyncHandler(async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {  
        return res.status(400).json(new ApiError(400, "Validation   errors", errors.array()));
    }
    const { email, password } = req.body
    if (!email) {
        throw new ApiError(400, "Enter email")
    }
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        throw new ApiError(401, "Invalid email")
    }
    const isValidPassword = await user.isPasswordCorrect(password)
    if (!isValidPassword) {
        throw new ApiError(401, "Invalid User Credentials")
    }

    const token = await user.generateAuthToken()
    res.cookie('token', token,
        { httpOnly: true, }
    )

    return res.status(200).json(
        new ApiResponse(200, "User logedin Successfully", { user, token },)
    )
})

const getUserProfile = AsyncHandler(async (req, res, next) => {
    const userProfile = req.user
    if(!userProfile){
        throw new ApiError(401, "user profile not found")
    }
    return res.status(200)
        .json(
            userProfile
        )
})

const logoutUser = AsyncHandler(async (req, res, next) => {
    res.clearCookie('token')
    const token = req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");

    // Blacklist the token if it exists
    if (token) {
        try {
            await BlacklistedToken.create({token}) 
        }catch (error) {
            if (error.code === 11000) {
                console.warn("Token is already blacklisted");
            } else {
                throw error;
            }
        }
    }
    return res.status(200).json(
        new ApiResponse(200, "User Logged Out")
    );
});

export {
    registerUser,
    loginUser,
    getUserProfile,
    logoutUser
};
