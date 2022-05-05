//---------------------------------------------|
//           All required modules
//---------------------------------------------|
const brandModel = require("../models/brandModel");
const brandValidators = require("../validation/brandValidators");
const asyncHandler = require("express-async-handler");
const { notOwner } = require("../helpers/privilleges");
const cleanName = require("../helpers/namesFuns");

//---------------------------------------------|
//           GET ALL BRANDS
//---------------------------------------------|
const getAllBrands = asyncHandler(async (req, res) => {
  const brands = await brandModel.find().populate("publisher", ["name"]);
  if (brands) {
    return res.status(200).json(brands);
  }
});

//---------------------------------------------|
//           GET BRAND BY ID
//---------------------------------------------|
const getBrandById = asyncHandler(async (req, res) => {
  const brand = await brandModel.findOne({ _id: req.params.brandID });
  return res.status(200).json(brand);
});

//---------------------------------------------|
//           ADD NEW BRAND
//---------------------------------------------|
const addNewBrand = asyncHandler(async (req, res) => {
  const { isValid, errors } = brandValidators(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const brandExists = await brandModel.findOne({
    name: cleanName(req.body.name),
  });
  if (brandExists) {
    const errors = {};
    errors.name = "Name must be unique";
    return res.status(400).json(errors);
  }

  const newBrandModel = new brandModel({
    name: cleanName(req.body.name),
    description: req.body.description,
    publisher: req.user.id,
  });
  await newBrandModel.save();

  const populatedBrand = await brandModel.populate(newBrandModel, {
    path: "publisher",
    select: "name",
  });
  res.status(201).json(populatedBrand);
});

//---------------------------------------------|
//           UPDATE BRAND
//---------------------------------------------|
const updateBrand = asyncHandler(async (req, res) => {
  // check for brand owner
  const brand = await brandModel.findById(req.params.brandID);
  if (!notOwner(req, res, brand.publisher, "brand")) {
    //check for validations
    const { isValid, errors } = brandValidators(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }

    const brandExists = await brandModel.findOne({
      $and: [
        { name: cleanName(req.body.name) },
        { _id: { $ne: req.params.brandID } },
      ],
    });
    if (brandExists) {
      const errors = {};
      errors.name = "Name must be unique";
      return res.status(400).json(errors);
    }

    const newBrandModel = {
      name: cleanName(req.body.name),
      description: req.body.description,
      brand: req.body.brand,
    };

    const updatedBrand = await brandModel
      .findOneAndUpdate(
        { _id: req.params.brandID },
        { $set: newBrandModel },
        { new: true }
      )
      .populate("publisher", ["name"]);
    res.status(200).json(updatedBrand);
  }
});

//---------------------------------------------|
//           DELETE BRAND
//---------------------------------------------|
const deleteBrandByID = asyncHandler(async (req, res) => {
  const brand = await brandModel.findById(req.params.brandID);
  if (!notOwner(req, res, brand.publisher, "brand")) {
    await brandModel.findOneAndDelete(
      { _id: req.params.brandID },
      { new: true }
    );
    return res.status(200).json("done");
  }
});

// export modules
module.exports = {
  getAllBrands,
  getBrandById,
  addNewBrand,
  updateBrand,
  deleteBrandByID,
};
