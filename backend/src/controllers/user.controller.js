import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.models.js"
// import {uploadOnCloudinary} from "../utils/claudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"



const generateAccessAndRefereshTokens = async(userId) =>{
    try {
        const user = await User.findById(userId)
   
        const accessToken = user.generateAccessToken()
        
        const refreshToken = user.generateRefreshToken()
        
        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}


const registerUser = asyncHandler(async (req, res) => {
    const { fullName, username, email, password, role } = req.body;

    // Check if all required fields are present
    if (!fullName || !username || !email || !password || !role) {
        throw new ApiError(400, "All fields are required");
    }

    // Check if any field is empty after trimming
    if ([fullName, username, email, password, role].some((field) => field.trim() === "")) {
        throw new ApiError(400, "All fields are required and cannot be empty");
    }

    // Validate role
    if (!['customer', 'seller'].includes(role)) {
        throw new ApiError(400, "Invalid role. Must be either 'customer' or 'seller'");
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
        role
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



const loginUser = asyncHandler(async (req, res) => {
    const { email, username, password } = req.body;

    if (!username && !email) {
        throw new ApiError(400, "Either email or username is required");
    }

    const user = await User.findOne({
        $or: [{ email }, { username }]
    });

    if (!user) {
        throw new ApiError(401, "User has not been registered");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid password");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const cookiesOptions = {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
        secure: true,
    };

    // Determine the dashboard URL based on the user's role
    let dashboardUrl;
    if (user.role === 'seller') {
        dashboardUrl = '/seller-dashboard';
    } else if (user.role === 'buyer') {
        dashboardUrl = '/buyer-dashboard';
    } else {
        dashboardUrl = '/default-dashboard';
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, cookiesOptions)
        .cookie("refreshToken", refreshToken, cookiesOptions)
        .json(
            new ApiResponse(
                200,
                { user: loggedInUser, dashboardUrl },
                "Logged in successfully"
            )
        );
});


export {registerUser}
export{loginUser}