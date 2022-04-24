//---------------------------------------------|
//           All required modules              |
//---------------------------------------------|
const express = require("express");
const router = express.Router();
const userModel = require("../../models/userModel");
const tokenModel = require("../../models/tokenModel");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const userValidators = require("../../validation/userValidators");
const fs = require("fs");
const nodemailer = require("nodemailer");
const resetPassEmailValidators = require("../../validation/resetPassEmailValidators");
const resetpassValidators = require("../../validation/resetpassValidators");
const upload = require("../../helpers/userAvatar");
const {
  getAllUsers,
  register,
  login,
  deleteUser,
  editUserRole,
  editUserProfile,
  getUserById,
} = require("../../controllers/userControllers");

//---------------------------------------------|
//           POST REGISTER
//---------------------------------------------|
router.route("/register").post(register);

//---------------------------------------------|
//             POST Login USER
//---------------------------------------------|
router.route("/login").post(login);

//---------------------------------------------|
//           GET ALL USERS
//---------------------------------------------|
router
  .route("/all")
  .get(passport.authenticate("jwt", { session: false }), getAllUsers);

//---------------------------------------------|
//           DELETE USER
//---------------------------------------------|
router
  .route("/:userID")
  .delete(passport.authenticate("jwt", { session: false }), deleteUser);

//---------------------------------------------|
//           EDIT USER ROLE BY ID
//---------------------------------------------|
router
  .route("/role/:userID")
  .put(passport.authenticate("jwt", { session: false }), editUserRole);

//---------------------------------------------|
//             GET USER BY ID
//---------------------------------------------|
router
  .route("/:userID")
  .get(passport.authenticate("jwt", { session: false }), getUserById);

//---------------------------------------------|
//             EDIT_USER_PROFILE
//---------------------------------------------|
router
  .route("/edit")
  .put(passport.authenticate("jwt", { session: false }), editUserProfile);

//---------------------------------------------|
//             CHANGE USER IMAGE               |
//---------------------------------------------|
router.put(
  "/changeImg",
  passport.authenticate("jwt", { session: false }),
  upload.single("userAvatar"),
  (err, req, res, next) => {
    if (err) {
      let errors = {};
      errors.userAvatar = err.message;
      return res.status(400).json(errors);
    }
  },
  (req, res) => {
    if (req.file) {
      if (req.body.oldImg != "noimage.png") {
        fs.unlink("public/userAvatar/" + req.body.oldImg, (err) => {
          if (err) {
            console.log(err);
          }
        });
      }

      const updateImg = {
        avatar: req.file.filename,
      };

      userModel
        .findOneAndUpdate({ _id: req.user.id }, { $set: updateImg })
        .then((user) => {
          return res.status(200).json({ msg: "done" });
        })
        .catch((err) => console.log(err.response.data));
    }
  }
);

//---------------------------------------------|
//      SEND EMAIL FOR RESET PASSWORD          |
//---------------------------------------------|
router.post("/reset-password-by-mail", (req, res) => {
  let { isValid, errors } = resetPassEmailValidators(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const token = `${Math.random(Date.now() * 580585)}`;
  const transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 587, //25 2525 587 465
    auth: {
      user: "7343e6cf3ef96c",
      pass: "f1c870dffc07e5",
    },
  });
  const mailOptions = {
    from: "gadelgadid@gmail.com",
    to: req.body.email,
    subject: "Reset password",
    html: `
            <h3>Follow this link to reset</h3>
            <a href="http://localhost:3000/reset-password/${token}/${req.body.email}">Reset your password </a>`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      const newTokenModel = new tokenModel({ token });
      newTokenModel
        .save()
        .then((tok) => {
          console.log(info);
          res.status(200).json(token);
        })
        .catch((err) => console.log(err));
    }
  });
});

//---------------------------------------------|
//               RESET PASSWORD                |
//---------------------------------------------|
router.post("/resetPass/:token/:email", (req, res) => {
  let { isValid, errors } = resetpassValidators(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  userModel
    .findOne({ email: req.params.email })
    .then((user) => {
      if (user) {
        tokenModel
          .findOne({ token: req.params.token })
          .then((token) => {
            if (token) {
              bcrypt.genSalt(10, (err, salt) => {
                if (err) {
                  console.log(err);
                }
                bcrypt.hash(req.body.password, salt, (err, hash) => {
                  if (err) {
                    console.log(err);
                  }
                  console.log(hash);
                  userModel
                    .updateOne(
                      { email: req.params.email },
                      { $set: { password: hash } }
                    )
                    .then((done) => res.status(200).json("done"))
                    .catch((err) => console.log(err));
                });
              });
            }
          })
          .catch((err) => console.log(err));
      }
    })
    .catch((err) => console.log(err));
});

////////////////////////
module.exports = router;
