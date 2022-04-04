const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// Create Schema
const BrandSchema = new Schema({

  name: { type: String, required: true },
  
  description: { type: String },
  
  publisher: { type: Schema.Types.ObjectId, ref: 'users' }

}, );


module.exports  = mongoose.model('brand', BrandSchema);
