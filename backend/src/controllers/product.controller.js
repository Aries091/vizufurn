import { ApiError } from "../utils/ApiError.js";
import { Product } from "../models/products.models.js";
import { uploadOnCloudinary } from "../utils/claudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { CATEGORIES } from '../Constant/categories.js';

const publishProduct = asyncHandler(async (req, res) => {
    try {
        console.log("Starting publishProduct function");

        // Debugging: log request body and files
        console.log("Request body:", req.body);
        console.log("Files:", req.files);

        if (!req.user || !req.user._id) {
            throw new ApiError(401, "User not authenticated");
        }

        const { name, description, price, category } = req.body;
        
        if (!name || !description || !price || !category) {
            throw new ApiError(400, "Please fill all fields");
        }

        // Check if the category is valid
        if (!Object.values(CATEGORIES).includes(category)) {
            throw new ApiError(400, "Invalid category");
        }

        // Check if images are provided
        const displayImageLocalPath = req.files?.displayImage?.[0]?.path;
        const modelImageLocalPath = req.files?.modelImage?.[0]?.path;

        if (!displayImageLocalPath) {
            throw new ApiError(400, "Please upload a display image");
        }
        if (!modelImageLocalPath) {
            throw new ApiError(400, "Please upload a model image");
        }

        // Upload images to Cloudinary
        console.log("Uploading images to Cloudinary");
        const displayImage = await uploadOnCloudinary(displayImageLocalPath);
        const modelImage = await uploadOnCloudinary(modelImageLocalPath);

        console.log("Cloudinary responses:", { displayImage, modelImage });

        if (!displayImage || !modelImage) {
            console.error("Failed to upload images:", { displayImage, modelImage });
            throw new ApiError(400, "Failed to upload images");
        }

        // Create product in the database
        const product = await Product.create({
            name,
            description,
            price,
            displayImage: displayImage.url,
            modelImage: modelImage.url,
            seller: req.user._id,
            stock: req.body.stock || 0,
            category,
        });

        console.log("Product created:", product);

        return res.status(201).json(new ApiResponse(201, product, "Product published successfully"));
    } catch (error) {
        console.error("Error in publishProduct:", error);
        if (error instanceof ApiError) {
            return res.status(error.statusCode).json(new ApiResponse(error.statusCode, null, error.message));
        }
        return res.status(500).json(new ApiResponse(500, null, "Internal Server Error"));
    }
});

export { publishProduct };