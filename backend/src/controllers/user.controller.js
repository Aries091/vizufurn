import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.models.js"
// import {uploadOnCloudinary} from "../utils/claudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"
// import jwt from "jsonwebtoken"



// const generateAccessAndRefereshTokens = async(userId) =>{
//     try {
//         const user = await User.findById(userId)
   
//         const accessToken = user.generateAccessToken()
        
//         const refreshToken = user.generateRefreshToken()
        
//         user.refreshToken = refreshToken
//         await user.save({ validateBeforeSave: false })

//         return {accessToken, refreshToken}


//     } catch (error) {
//         throw new ApiError(500, "Something went wrong while generating referesh and access token")
//     }
// }


const registerUser = asyncHandler(async (req, res) => {
    const { fullName, username, email, password } = req.body;
    console.log("Request Body:", req.body);

    // Check if all required fields are present
    if (!fullName || !username || !email || !password) {
        throw new ApiError(400, "All fields are required");
    }

    // Check if any field is empty after trimming
    if ([fullName, username, email, password].some((field) => field.trim() === "")) {
        throw new ApiError(400, "All fields are required and cannot be empty");
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (existedUser) {
        throw new ApiError(409, "Username or email already exists");
    }

    // Make sure username is defined before calling toLowerCase()
    const lowercaseUsername = username ? username.toLowerCase() : "";

    const user = await User.create({
        fullName,
        username: lowercaseUsername,
        email,
        password,
    });

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering");
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "Registered successfully")
    );
});


export {registerUser}