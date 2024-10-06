import { ApiError } from "../utils/ApiError.js";
import { Product } from "../models/products.models.js";
import { uploadOnCloudinary } from "../utils/claudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { CATEGORIES } from '../Constant/categories.js';


const publishProduct = asyncHandler(async (req, res) => {
    try {
        console.log("Starting publishProduct function");

        console.log("Request body:", req.body);
        console.log("Files:", req.files);

        const { name, description, price, category } = req.body;
        
        if (!name || !description || !price || !category) {
            throw new ApiError(400, "Please fill all fields");
        }

        if (!Object.values(CATEGORIES).includes(category)) {
            throw new ApiError(400, "Invalid category");
        }

        const displayImageLocalPath = req.files?.displayImage?.[0]?.path;
        const modelImageLocalPath = req.files?.modelImage?.[0]?.path;

        if (!displayImageLocalPath) {
            throw new ApiError(400, "Please upload a display image");
        }
        if (!modelImageLocalPath) {
            throw new ApiError(400, "Please upload a model image");
        }

        console.log("Uploading images to Cloudinary");
        const displayImage = await uploadOnCloudinary(displayImageLocalPath);
        const modelImage = await uploadOnCloudinary(modelImageLocalPath);

        console.log("Cloudinary responses:", { displayImage, modelImage });

        if (!displayImage || !modelImage) {
            console.error("Failed to upload images:", { displayImage, modelImage });
            throw new ApiError(400, "Failed to upload images");
        }

        const product = await Product.create({
            name,
            description,
            price,
            displayImage: displayImage.url,
            modelImage: modelImage.url,
            // Remove the seller field if it's required in your schema
            // If it's optional, you can set it to null or remove it
            // seller: null,
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


const deleteProduct =asyncHandler(async(req,res)=>{

    try{
        const productId = req.params.productId;
       
        if(!productId){
            throw new ApiError(400, "Product ID is required");
        }
        const product = await Product.findById(productId)

        if(!product){
            throw new ApiError(404, "Product not found");
        }
        
        await Product.findByIdAndDelete(productId);
        return res.status(200)
        .json(new ApiResponse(200, null, "Product deleted successfully"));

        
    }
    catch(error){
        console.error("Error in deleteProduct",error);
        if(error instanceof ApiError){
            return res.status(error.statusCode)
            .json(new ApiResponse(error.statusCode, null, error.message));

    }
}
})
const updateProduct = asyncHandler(async(req,res)=>{
    try{
        const{productId}=req.params;
        const {name,description,price,stock}=req.body;
        if(!productId){
            throw new ApiError(400, "Product ID is required");
        }
        const product = await Product.findById(productId);
        if(!product){
            throw new ApiError(404, "Product not found");
        }
        if(name) product.name=name;
        if(description)product.description=description;
        if(price) product.price =price;
        if(stock) product.stock=stock;

        if(category){
            if(!Object.values(CATEGORIES).includes(category)){
                throw new ApiError(400, "Invalid category");
            }
            product.category=category;

        }
        const displayImageLocalPath=req.files?.dislayImage?.pth;
        if(displayImageLocalPath){
            const displayImage = await uploadOnCloudinary(displayImageLocalPath);
            if(displayImage){
                product.displayImage=displayImage.url;
            }
        }
        const modelImageLocalPath = req.files?.displayImage?.[0]?.path;
        if(modelImageLocalPath){
            const modelImage =await uploadOnCloudinary(modelImageLocalPath);
            if(modelImage){
                product.modelImage=modelImage.url;
            }
        }
        await product.save();
        return res.status(200).json (
            new ApiResponse(200, product, "Product updated successfully")
        );


    }
    catch(error){
        console.error("Error in updateProduct",error)
        if (error instanceof ApiError){
            return res.status(error.status)
            .json( new ApiResponse(error.statusCode,null,error.message));
            
        }
        return res.status(500).json(new ApiResponse(500,null,"Internal Server Error"));
    }
})


export { publishProduct,deleteProduct };