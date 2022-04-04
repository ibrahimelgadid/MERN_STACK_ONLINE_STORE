//---------------------------------------------|
//           All required modules              |
//---------------------------------------------|
const User = require("../models/User");
const jwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const passport = require("passport");
const secretOrKey = require('../config/jwtSecret').secret;


const options = {
    jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey:secretOrKey
}


module.exports = passport=>{
    passport.use(new jwtStrategy(options, (jwt_payload,done)=>{
        User.findById(jwt_payload.id)
            .then(user=>{
                if (user) {
                    return done(null, user)
                }
                return done(null, false)
            })
            .catch(err=>console.log(err))
    }))
};