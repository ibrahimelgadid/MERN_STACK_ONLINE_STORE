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
        "https://res.cloudinary.com/dbti7atfu/image/upload/v1657783948/mern_stack_project/noimage_j9qyxs.png",
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
