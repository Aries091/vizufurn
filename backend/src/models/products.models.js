import mongoose from 'mongoose'

// Define the Category schema
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: false
  },
}, { timestamps: true });

// Define the Product schema
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  displayImage: {
    type: String,  // URL to image
    required: true
  },
  modelImage: {
    type: String,  // URL to 3D model image
    required: true
  },
  stock: {
    type: Number,
    required: true,
    default: 0
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

// Create the models
export const Category = mongoose.model('Category', categorySchema);
export const Product = mongoose.model('Product', productSchema);