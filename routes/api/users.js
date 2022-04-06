//---------------------------------------------|
//           All required modules              |
//---------------------------------------------|
const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const Token = require('../../models/token');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const registrationError = require('../../validation/register');
const loginErrors = require('../../validation/login');
const validateUserInput = require('../../validation/user')
const multer = require('multer');
const fs = require('fs');
const nodemailer = require('nodemailer');
const resetPassword = require('../../validation/resetPassword');
const resetpass = require('../../validation/resetpass');




//---------------------------------------------|
//           Image upload setup                |
//---------------------------------------------|
const storage = multer.diskStorage({
    destination:function (req,file, cb) {
    let path ;
    if ( fs.existsSync('public/userAvatar/')) {
        path = 'public/userAvatar/';
    } 
    else {
        path = fs.mkdirSync('public/userAvatar/',{ recursive: true });
    }
        cb(null, path)
    },
        filename :function (req,file, cb) {
    cb(null,file.originalname+req.user.name+Date.now()+file.originalname)
    }
})

const upload = multer({
    storage:storage,
    fileFilter:function (req, file, cb) {
        const fileSize = parseInt(req.headers['content-length']);
        let mime = file.mimetype;
        if (!(mime==='image/png'||mime==='image/jpeg'||mime==='image/jpg')) {
            cb( new Error('You must choose jpg, png, jpeg'), false)
        }else if (fileSize > 1024*1024*2) {
            cb( new Error('Image size must not exceed 2mb'), false)
        }else{
            cb(null,true)
        }
    }
});





//---------------------------------------------|
//           GET ALL USERS                     |
//---------------------------------------------|
router.get('/all',passport.authenticate('jwt', {session:false}), (req, res) =>{
    if (req.user.role !== 'user') {
        
        User.find()
            .then(users=>{
                return res.status(200).json(users)
            })
            .catch(err=>console.log(err))
    }else{
        let errors = {};
        errors.userNotAdmin = "You are not have admin privilleges";
        return res.status(400).json(errors)
    }
});


//---------------------------------------------|
//           DELETE USER                       |
//---------------------------------------------|
router.delete('/:user_id',passport.authenticate('jwt', {session:false}), 
    (req, res) =>{
        if (req.user.role === 'superAdmin') {
            User.deleteOne({_id:req.params.user_id})
                .then(user=>{
                    return res.status(200).json('done')
                })
                .catch(err=>console.log(err))
        }else{
            let errors = {};
            errors.userNotAdmin = "You are not have admin privilleges";
            return res.status(400).json(errors)
        }
});



//---------------------------------------------|
//           EDIT USER ROLE BY ID              |
//---------------------------------------------|
router.put('/role/:user_id',passport.authenticate('jwt',{session:false}),
    (req,res)=>{
        if(req.user.role ==='superAdmin'){
            User.findOneAndUpdate({_id:req.params.user_id}, 
                {$set:{role:req.body.role}},{new:true})
                .then(user=>res.status(200).json(user))
                .catch(err=> console.log(err))
        }else{
            let errors = {};
        errors.userNotAdmin = "You are not have admin privilleges";
        return res.status(400).json(errors)
        }
    }
)


//---------------------------------------------|
//             GET USER BY ID                  |
//---------------------------------------------|
router.get('/:user_id',passport.authenticate('jwt',{session:false}),
    (req,res)=>{
        if(req.user.role !=='user'){
            User.findOne({_id:req.params.user_id})
                .then(user=>res.status(200).json(user))
                .catch(err=> console.log(err))
        }else{
            let errors = {};
        errors.userNotAdmin = "You are not have admin privilleges";
        return res.status(400).json(errors)
        }
    }
)



//---------------------------------------------|
//           POST REGISTER USER                |
//---------------------------------------------|
router.post('/register',(req,res,next)=>{
    let{ errors, isValid }= registrationError(req.body);
    if(!isValid){
        return res.status(400).json(errors)
    }
    
    User.findOne({email:req.body.email})
        .then(user=>{
            if (user) {
                errors.email = "email already exists";
                return res.status(400).json(errors)
            }else{
                const newUser = new User({
                    name:req.body.name,
                    email:req.body.email,
                    password:req.body.password
                })
                bcrypt.genSalt(10,(err, salt)=>{
                    if (err) {console.log(err);}
                    bcrypt.hash(newUser.password,salt,(err,hash)=>{
                        if (err) {console.log(err);}
                        newUser.password = hash;
                        newUser.save((err,done)=>{
                            if (err) res.status(400).json(err);
                            
                            const {name, avatar, _id,email} = done
                            res.json({name, avatar, _id,email})
                        })
                    })
                })
            }
        })
});



//---------------------------------------------|
//             POST Login USER                 |
//---------------------------------------------|
router.post('/login',(req,res,next)=>{
    let {errors, isValid} = loginErrors(req.body);
    if(!isValid){
        return res.status(400).json(errors)
    }
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({email}, (err,user)=>{
    if (err) {console.log(err);}
        if(!user){
            errors.email = "User not exist";
            return res.status(404).json(errors)
        }
        bcrypt.compare(password, user.password, (err,match)=>{
        if (err) {console.log(err);}
        if(!match){
            errors.password = "Password is wrong"
            return res.status(404).json(errors)
        }
        let payload = {
            id:user.id,
            name:user.name,
            email:user.email,
            avatar:user.avatar,
            role:user.role,
            social:user.social
            }

        jwt.sign(payload, process.env.JWT_SECRET, {expiresIn:3600*24}, (err,token)=>{
            
            if (err) {console.log(err);}

            res.json({
                success:true,
                token:`Bearer ${token}`
            })
        })
        })
})
});




//---------------------------------------------|
//             EDIT_USER_PROFILE               |
//---------------------------------------------|
router.put('/edit', passport.authenticate('jwt', {session:false}),(req,res)=>{
    let {errors, isValid} = validateUserInput(req.body);
    if(!isValid){
        return res.status(400).json(errors)
    }

    User.findOne({email:req.body.email})
    .then(user=>{
        if(user){
            if(user.id !== req.user.id){
                errors.email = 'This email is exists'
                return res.status(400).json(errors)
            }
        }
        let userEditData = {
            name:req.body.name,
            email:req.body.email,
            address:req.body.address,
            social:{
                youtube:req.body.youtube,
                facebook:req.body.facebook,
                twitter:req.body.twitter,
                instagram:req.body.instagram,
            }
        }
            User.findOneAndUpdate({_id:req.user.id},{$set:userEditData}, {new:true})
                .then(userData=>res.status(200).json(userData))
                .catch(err=>console.log(err))
        }).catch(err=>console.log(err))
});


//---------------------------------------------|
//             CHANGE USER IMAGE               |
//---------------------------------------------|
router.put('/changeImg',passport.authenticate('jwt', {session:false}),
    upload.single('userAvatar'), (err,req, res,next)=>{
    if (err) {
        let errors = {};
        errors.userAvatar = err.message;
        return res.status(400).json(errors)
    }
},(req,res)=>{
    if (req.file) {
        if (req.body.oldImg != "noimage.png") {
            fs.unlink("public/userAvatar/"+req.body.oldImg, (err)=>{
                if (err) {
                console.log(err)
                } 
            })
        }
        
        const updateImg = {
        avatar:req.file.filename
        }
        
        User.findOneAndUpdate({_id:req.user.id},{$set:updateImg})
        .then(user=>{
            return res.status(200).json({msg:'done'})
        }).catch((err=>console.log(err.response.data)))
    }
});


//---------------------------------------------|
//      SEND EMAIL FOR RESET PASSWORD          |
//---------------------------------------------|
router.post('/reset-password-by-mail', (req,res)=>
    {
        let {isValid, errors} = resetPassword(req.body);

        if(!isValid){
            return res.status(400).json(errors);
        }

        const token = `${Math.random(Date.now()*580585)}`;
        const transporter = nodemailer.createTransport({
            host: "smtp.mailtrap.io",
            port: 587,//25 2525 587 465
            auth: {
                user: "7343e6cf3ef96c",
                pass: "f1c870dffc07e5"
            }
        });
        const mailOptions = {
            from: 'gadelgadid@gmail.com',
            to: req.body.email,
            subject: 'Reset password',
            html: `
            <h3>Follow this link to reset</h3>
            <a href="http://localhost:3000/reset-password/${token}/${req.body.email}">Reset your password </a>`
        };

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
            } else {
                const tokenData = new Token({token})
                tokenData.save()
                .then(tok=>{
                    console.log(info);
                    res.status(200).json(token)
                }).catch(err=>console.log(err))
            }
        });

    }
)



//---------------------------------------------|
//               RESET PASSWORD                |
//---------------------------------------------|
router.post('/resetPass/:token/:email',(req,res)=>{

    let {isValid, errors} = resetpass(req.body);

    if(!isValid){
        return res.status(400).json(errors);
    }

    User.findOne({email:req.params.email})
        .then(user=>{
            if (user) {
                Token.findOne({token:req.params.token})
                    .then(token=>{
                        if (token) {
                            bcrypt.genSalt(10,(err, salt)=>{
                                if (err) {console.log(err);}
                                bcrypt.hash(req.body.password,salt,(err,hash)=>{
                                    if (err) {console.log(err);}
                                    console.log(hash);
                                    User.updateOne({email:req.params.email},{$set:{password:hash}} )
                                        .then(done=>res.status(200).json('done'))
                                        .catch(err=>console.log(err))
                                })
                            })
                        }
                    }).catch(err=>console.log(err))
            }
        }).catch(err=>console.log(err))
})

////////////////////////
module.exports = router;