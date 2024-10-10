import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";

export const verifyJWT = (roles = []) => asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "").trim();
    
    if (!token) {
      throw new ApiError(401, "Unauthorized request: No token provided");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

    if (!user) {
      throw new ApiError(401, "Unauthorized request: Invalid token");
    }

    // Role checking
    if (roles.length && !roles.includes(user.role)) {
      throw new ApiError(403, "Forbidden: You don't have permission to access this resource");
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new ApiError(401, "Unauthorized request: Invalid token");
    }
    throw new ApiError(error.statusCode || 401, error.message || "Invalid access token");
  }
});