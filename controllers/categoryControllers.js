//---------------------------------------------|
//           All required modules
//---------------------------------------------|
const categoryModel = require("../models/categoryModel");
const categoryValidators = require("../validation/categoryValidators");
const asyncHandler = require("express-async-handler");
const { notOwner } = require("../helpers/privilleges");
const cleanName = require("../helpers/namesFuns");

//---------------------------------------------|
//           GET ALL CATEGORY
//---------------------------------------------|
const getAllCategories = asyncHandler(async (req, res) => {
  const category = await categoryModel.find().populate("publisher", ["name"]);
  return res.status(200).json(category);
});

//---------------------------------------------|
//           GET CATEGORY BY ID
//---------------------------------------------|
const getCategoryById = asyncHandler(async (req, res) => {
  const category = await categoryModel.findOne({ _id: req.params.categoryID });
  return res.status(200).json(category);
});

//---------------------------------------------|
//           ADD NEW CATEGORY
//---------------------------------------------|
const addNewCategory = asyncHandler(async (req, res) => {
  const { isValid, errors } = categoryValidators(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const categoryExists = await categoryModel.findOne({
    name: cleanName(req.body.name),
  });
  if (categoryExists) {
    const errors = {};
    errors.name = "Name must be unique";
    return res.status(400).json(errors);
  }

  const newCategoryModel = new categoryModel({
    name: cleanName(req.body.name),
    description: req.body.description,
    publisher: req.user.id,
  });
  await newCategoryModel.save();
  const populatedCategory = await categoryModel.populate(newCategoryModel, {
    path: "publisher",
    select: "name",
  });
  res.status(201).json(populatedCategory);
});

//---------------------------------------------|
//           UPDATE CATEGORY
//---------------------------------------------|
const updateCategory = asyncHandler(async (req, res) => {
  const category = await categoryModel.findById(req.params.categoryID);

  if (!notOwner(req, res, category.publisher, "category")) {
    //check for validations
    const { isValid, errors } = categoryValidators(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }

    const categoryExists = await categoryModel.findOne({
      $and: [
        { name: cleanName(req.body.name) },
        { _id: { $ne: req.params.categoryID } },
      ],
    });
    if (categoryExists) {
      const errors = {};
      errors.name = "Name must be unique";
      return res.status(400).json(errors);
    }

    const newCategoryModel = {
      name: cleanName(req.body.name),
      description: req.body.description,
      category: req.body.category,
    };

    const updatedCategory = await categoryModel
      .findOneAndUpdate(
        { _id: req.params.categoryID },
        { $set: newCategoryModel },
        { new: true }
      )
      .populate("publisher", ["name"]);
    res.status(200).json(updatedCategory);
  }
});

//---------------------------------------------|
//           DELETE CATEGORY
//---------------------------------------------|
const deleteCategoryByID = asyncHandler(async (req, res) => {
  const category = await categoryModel.findById(req.params.categoryID);

  if (!notOwner(req, res, category.publisher, "category....")) {
    const deletedCategory = await categoryModel.findOneAndDelete(
      { _id: req.params.categoryID },
      { new: true }
    );
    if (deletedCategory) {
      return res.status(200).json("done");
    } else {
      const errors = {};
      errors.category = "There is no category for this id";
      return res.status(400).json(errors);
    }
  }
});
// export modules
module.exports = {
  getAllCategories,
  getCategoryById,
  addNewCategory,
  updateCategory,
  deleteCategoryByID,
};
