import { ApiError } from "../utils/ApiError.js"
import { Product } from "../models/products.models.js"
import { uploadOnCloudinary } from "../utils/claudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const publishProduct = asyncHandler(async (req, res) => {
    try {
        console.log("Starting publishProduct function");
        const { name, description, price } = req.body
        console.log("Request body:", { name, description, price });

        if (!name || !description || !price) {
            throw new ApiError(400, "Please fill all fields")
        }

        console.log("Files received:", req.files);
        const displayImageLocalPath = req.files?.displayImage?.[0]?.path
        const modelImageLocalPath = req.files?.modelImage?.[0]?.path

        console.log("Image paths:", { displayImageLocalPath, modelImageLocalPath });

        if (!displayImageLocalPath) {
            throw new ApiError(400, "Please upload a display image")
        }
        if (!modelImageLocalPath) {
            throw new ApiError(400, "Please upload a model image")
        }

        console.log("Uploading images to Cloudinary");
        const displayImage = await uploadOnCloudinary(displayImageLocalPath)
        const modelImage = await uploadOnCloudinary(modelImageLocalPath)

        console.log("Cloudinary responses:", { displayImage, modelImage });

        if (!displayImage || !modelImage) {
            throw new ApiError(400, "Failed to upload images")
        }

        console.log("Creating product in database");
        const product = await Product.create({
            name,
            description,
            price,
            displayImage: displayImage.url,
            modelImage: modelImage.url,
            seller: req.user._id,
            stock: req.body.stock || 0,  // Default to 0 if not provided
            category: req.body.categoryId  // Assuming category ID is sent in the request body
        })
        console.log("Product created:", product);

        console.log("Sending response");
        return res
            .status(201)
            .json(new ApiResponse(201, product, "Product published successfully"))
    } catch (error) {
        console.error("Error in publishProduct:", error);
        if (error instanceof ApiError) {
            return res.status(error.statusCode).json(new ApiResponse(error.statusCode, null, error.message))
        }
        return res.status(500).json(new ApiResponse(500, null, "Internal Server Error"))
    }
})

export { publishProduct }