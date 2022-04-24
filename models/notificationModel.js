const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const notificationSchema = new Schema(
  {
    data: { type: {}, required: true },

    from: { type: Schema.Types.ObjectId, ref: "userModel" },

    to: { type: [String] },

    type: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("notificationModel", notificationSchema);
