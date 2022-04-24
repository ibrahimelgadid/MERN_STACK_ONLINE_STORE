//---------------------------------------------|
//           All required modules
//---------------------------------------------|
const bcrypt = require("bcryptjs");
const registerValidators = require("../validation/registerValidators");
const userModel = require("../models/userModel");
const loginValidators = require("../validation/loginValidators");
const userValidators = require("../validation/userValidators");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

//---------------------------------------------|
//           POST REGISTER
//---------------------------------------------|
const register = asyncHandler(async (req, res) => {
  // body values
  const { name, email, password } = req.body;
  // inputs validation
  const { isValid, errors } = registerValidators(req.body);
  if (!isValid) return res.status(400).json(errors);
  // if this email exists
  const userExists = await userModel.findOne({ email });
  if (userExists) {
    errors.email = "This email already exists";
    return res.status(400).json(errors);
  } else {
    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // add new user
    const newUserModel = new userModel({
      name,
      email,
      password: hashedPassword,
    });
    const newUserAdded = await newUserModel.save();
    if (newUserAdded) {
      res.status(201).json(newUserAdded);
    } else {
      res.status(400).json({ RegErr: "Failed to create user" });
    }
  }
});

//---------------------------------------------|
//           LOGIN FUNCTION
//---------------------------------------------|
const login = asyncHandler(async (req, res) => {
  // body values
  const { email, password } = req.body;
  // inputs validation
  const { isValid, errors } = loginValidators(req.body);
  if (!isValid) return res.status(400).json(errors);
  // check if this email exists
  const user = await userModel.findOne({ email });
  if (!user) {
    errors.email = "This email is not exists";
    return res.status(404).json(errors);
  } else {
    // check if this password exists
    const matchPass = await bcrypt.compare(password, user.password);

    if (!matchPass) {
      errors.password = "Wrong password";
      return res.status(404).json(errors);
    } else {
      // return jwt token
      res.status(200).json({
        success: true,
        token: `Bearer ${generateToken(
          user.id,
          user.name,
          user.email,
          user.avatar,
          user.role,
          user.social
        )}`,
      });
    }
  }
});

//---------------------------------------------|
//           EDIT USER ROLE
//---------------------------------------------|
const editUserRole = asyncHandler(async (req, res) => {
  if (req.user.role === "superAdmin") {
    const updateUser = await userModel.findOneAndUpdate(
      { _id: req.params.userID },
      { $set: { role: req.body.role } },
      { new: true }
    );
    if (updateUser) {
      res.status(200).json(updateUser);
    } else {
      const errors = {};
      errors.userNotAdmin = "You are not have admin privilleges";
      return res.status(400).json(errors);
    }
  }
});
//---------------------------------------------|
//           GET ALL USERS
//---------------------------------------------|
const getAllUsers = asyncHandler(async (req, res) => {
  // access for admin or superAdmin
  if (req.user.role !== "user") {
    const users = await userModel.find();
    res.status(200).json(users);
  } else {
    const errors = {};
    errors.userNotAdmin = "You are not have admin privilleges";
    res.status(400).json(errors);
  }
});

//---------------------------------------------|
//           DELETE USER BY ID
//---------------------------------------------|
const deleteUser = asyncHandler(async (req, res) => {
  // access for superAdmin only
  if (req.user.role === "superAdmin") {
    const deleteUser = await userModel.deleteOne({ _id: req.params.userID });
    if (deleteUser) {
      res.status(200).json("done");
    }
  } else {
    let errors = {};
    errors.userNotAdmin = "You are not have admin privilleges";
    return res.status(400).json(errors);
  }
});

//---------------------------------------------|
//           GET USER BY ID
//---------------------------------------------|
const getUserById = asyncHandler(async (req, res) => {
  // access for superAdmin only
  if (req.user.role !== "user") {
    const user = await userModel.findOne({ _id: req.params.userID });
    if (user) {
      res.status(200).json(user);
    } else {
      const errors = {};
      errors.userNotAdmin = "You are not have admin privilleges";
      return res.status(400).json(errors);
    }
  }
});

//---------------------------------------------|
//           EDIT USER PROFILE
//---------------------------------------------|
const editUserProfile = asyncHandler(async (req, res) => {
  const { errors, isValid } = userValidators(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }
  const existsUser = await userModel.findOne({ email: req.body.email });
  if (existsUser && existsUser.id !== req.user.id) {
    errors.email = "This email is exists";
    return res.status(400).json(errors);
  }
  const userEditData = {
    name: req.body.name,
    email: req.body.email,
    address: req.body.address,
    social: {
      youtube: req.body.youtube,
      facebook: req.body.facebook,
      twitter: req.body.twitter,
      instagram: req.body.instagram,
    },
  };
  const updateUser = await userModel.findOneAndUpdate(
    { _id: req.user.id },
    { $set: userEditData },
    { new: true }
  );
  if (updateUser) {
    // return jwt token
    res.status(200).json({
      success: true,
      token: `Bearer ${generateToken(
        updateUser.id,
        updateUser.name,
        updateUser.email,
        updateUser.avatar,
        updateUser.role,
        updateUser.social
      )}`,
    });
  }
});

//---------------------------------------------|
//           generate token functionality
//---------------------------------------------|
const generateToken = (id, name, email, avatar, role, social) => {
  return jwt.sign(
    { id, name, email, avatar, role, social },
    process.env.JWT_SECRET,
    {
      expiresIn: "30d",
    }
  );
};

// export modules
module.exports = {
  getAllUsers,
  getUserById,
  editUserRole,
  editUserProfile,
  deleteUser,
  register,
  login,
};