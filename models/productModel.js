const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const productSchema = new Schema(
  {
    name: { type: String, required: true },

    price: { type: Number, required: true },

    category: { type: String, required: true },

    brand: { type: String, required: true },

    productImage: { type: String, default: "noimage.png" },

    productGallary: { type: [] },

    publisher: { type: Schema.Types.ObjectId, ref: "userModel" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("productModel", productSchema);