const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product name is required"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Description is required"],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
    min: [0, "Price cannot be negative"],
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: [true, "Category is required"],
  },
  sizes: [
    {
      type: String,
      enum: ["XS", "S", "M", "L", "XL"],
    },
  ],
  colors: [
    {
      name: { type: String, required: true, trim: true },
      hex: {
        type: String,
        required: true,
        match: [/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "Invalid hex color"],
      },
    },
  ],
  images: [
    {
      url: { type: String, required: true },
      publicId: { type: String, required: true },
    },
  ],
  stock: { type: Number, default: 0, min: 0 },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  numReviews: { type: Number, default: 0 },
  isBestSeller: { type: Boolean, default: false },
  isNewArrival: { type: Boolean, default: false },
});

module.exports = mongoose.model("Product", productSchema);