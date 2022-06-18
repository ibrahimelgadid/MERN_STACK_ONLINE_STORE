const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const productSchema = new Schema(
  {
    name: { type: String, required: true },

    price: { type: Number, required: true },

    category: { type: String, required: true },

    brand: { type: String, required: true },

    productImage: {
      type: String,
      default:
        "https://res.cloudinary.com/dbti7atfu/image/upload/v1655482753/NO_IMG_gr2aaj.png",
    },
    cloudinary_id: {
      type: String,
    },

    productGallary: [
      { img: { type: String }, cloudinary_id: { type: String } },
    ],

    publisher: { type: Schema.Types.ObjectId, ref: "userModel" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("productModel", productSchema);
