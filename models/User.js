const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    
    name:{ type:String, required:true },

    email:{ type:String, required:true },

    password:{  type:String, required:true },

    address:{  type:String},

    avatar:{ type:String, default:'noimage.png' },

    role:{ type:String, default:'user' },

    social: {
        youtube: { type: String },
        twitter: { type: String },
        facebook: { type: String },
        instagram: { type: String }
    },
    
},{timestamps:true});


module.exports = mongoose.model('users', UserSchema);