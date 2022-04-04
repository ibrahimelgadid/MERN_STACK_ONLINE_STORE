const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const TokenSchema = new Schema({
  token: { type: String },
  expireAt: {
    type: Date,
    default: Date.now,
    index: { expires: 1800000 },
  },
});


module.exports  = mongoose.model('token', TokenSchema);
