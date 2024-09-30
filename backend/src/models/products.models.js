import mongoose from 'mongoose';
import { CATEGORIES } from '../Constant/categories.js';

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
    type: String,
    enum: Object.values(CATEGORIES),
    required: true
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

export const Product = mongoose.model('Product', productSchema);