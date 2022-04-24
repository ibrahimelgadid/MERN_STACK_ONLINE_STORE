const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const brandSchema = new Schema({
  name: { type: String, required: true },

  description: { type: String },

  publisher: { type: Schema.Types.ObjectId, ref: "userModel" },
});

module.exports = mongoose.model("brandModel", brandSchema);
