const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },

    email: { type: String, required: true },

    password: { type: String, required: true },

    address: { type: String },

    avatar: {
      type: String,
      default:
        "https://res.cloudinary.com/dbti7atfu/image/upload/v1655482753/noimage_xvdwft.png",
    },
    cloudinary_id: {
      type: String,
    },

    role: { type: String, default: "user" },

    social: {
      youtube: { type: String },
      twitter: { type: String },
      facebook: { type: String },
      instagram: { type: String },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("userModel", userSchema);
