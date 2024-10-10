import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefereshTokens = async(userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new ApiError(404, "User not found");
        }
   
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        console.error("Token generation error:", error);
        throw new ApiError(500, "Something went wrong while generating refresh and access tokens");
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

    const lowercaseUsername = username.toLowerCase();

    const user = await User.create({
        fullName,
        username: lowercaseUsername,
        email,
        password,
        role
    });

    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id);

    const createdUser = await User.findById(user._id).select(
        "-password"
    );

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering");
    }

    const dashboardUrl = createdUser.getDashboardUrl();

    const cookiesOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
    };

    return res
        .status(201)
        .cookie("accessToken", accessToken, cookiesOptions)
        .cookie("refreshToken", refreshToken, cookiesOptions)
        .json(
            new ApiResponse(201, 
                {
                    user: createdUser,
                    accessToken,
                    refreshToken,
                    dashboardUrl
                }, 
                "User registered successfully")
        );
});

// ... (rest of the c
const loginUser = asyncHandler(async (req, res) => {
    const {email, username, password} = req.body

    if (!username && !email) {
        throw new ApiError(400, "Username or email is required")
    }

    const user = await User.findOne({
        $or: [{email}, {username}]
    })

    if (!user) {
        throw new ApiError(401, "Invalid credentials")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid credentials")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
    
    // Get dashboard URL using the new method
    const dashboardUrl = loggedInUser.getDashboardUrl()

    const cookiesOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV 
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, cookiesOptions)
        .cookie("refreshToken", refreshToken, cookiesOptions)
        .json(
            new ApiResponse(
                200, 
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken,
                    dashboardUrl
                },
                "Logged in successfully"
            )
        )
})

const logoutUser = asyncHandler(async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    );
    
    const cookiesOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
    };

    return res
        .status(200)
        .clearCookie("accessToken", cookiesOptions)
        .clearCookie("refreshToken", cookiesOptions)
        .json(new ApiResponse(200, {}, "Logged out successfully"));
});

const refreshAccessToken = asyncHandler(async(req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
    
    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request: No refresh token");
    }
    
    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );
        
        const user = await User.findById(decodedToken?.userId);
        if (!user) {
            throw new ApiError(401, "Invalid refresh token: User not found");
        }
        
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used");
        }
        
        const { accessToken, refreshToken: newRefreshToken } = 
            await generateAccessAndRefereshTokens(user._id);
        
        const cookiesOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production'
        };
        
        return res 
            .status(200)
            .cookie("accessToken", accessToken, cookiesOptions)
            .cookie("refreshToken", newRefreshToken, cookiesOptions)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken: newRefreshToken },
                    "Access token refreshed successfully"
                )
            );
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token");
    }
});

export { registerUser, loginUser, logoutUser, refreshAccessToken };