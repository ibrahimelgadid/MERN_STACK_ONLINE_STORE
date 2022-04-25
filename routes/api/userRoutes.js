//---------------------------------------------|
//           All required modules              |
//---------------------------------------------|
const express = require("express");
const router = express.Router();
const passport = require("passport");
const upload = require("../../helpers/userAvatar");
const {
  getAllUsers,
  register,
  login,
  deleteUser,
  editUserRole,
  editUserProfile,
  getUserById,
  changeImg,
  sendEmailForResetPass,
  resetPass,
} = require("../../controllers/userControllers");

//---------------------------------------------|
//           AUTH ROUTES
//---------------------------------------------|
// @access public

// register functionality
router.route("/register").post(register);

// login functionality
router.route("/login").post(login);

//---------------------------------------------|
//      PASSWORD RESET ROUTES
//---------------------------------------------|
// @access public

// send token to mailtrap for reset
router.route("/reset-password-by-mail").post(sendEmailForResetPass);

// create new password
router.route("/resetPass/:token/:email").post(resetPass);

//---------------------------------------------|
//           USER ROUTES
//---------------------------------------------|
// @access private

// get all users
router
  .route("/all")
  .get(passport.authenticate("jwt", { session: false }), getAllUsers);

// get user by id
router
  .route("/:userID")
  .get(passport.authenticate("jwt", { session: false }), getUserById);
// delete user by id
router
  .route("/:userID")
  .delete(passport.authenticate("jwt", { session: false }), deleteUser);

// change user role
router
  .route("/role/:userID")
  .put(passport.authenticate("jwt", { session: false }), editUserRole);

// edit user profile
router
  .route("/edit")
  .put(passport.authenticate("jwt", { session: false }), editUserProfile);

//change user imgae
router.route("/changeImg").put(
  passport.authenticate("jwt", {
    session: false,
  }),
  upload.single("userAvatar"),
  (err, req, res, next) => {
    if (err) {
      const errors = {};
      errors.userAvatar = err.message;
      return res.status(400).json(errors);
    }
    next();
  },
  changeImg
);

////////////////////////
module.exports = router;
