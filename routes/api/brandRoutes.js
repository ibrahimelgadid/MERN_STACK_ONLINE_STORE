//---------------------------------------------|
//           All required modules              |
//---------------------------------------------|
const express = require("express");
const router = express.Router();
const passport = require("passport");
const brandModel = require("../../models/brandModel");
const brandValidators = require("../../validation/brandValidators");

//---------------------------------------------|
//             GET ALL BRANDS                  |
//---------------------------------------------|
// public route
// access --> /brands
//----------------------|
router.get("/", (req, res) => {
  brandModel
    .find()
    .populate("publisher", ["name"])
    .then((brands) => {
      return res.status(200).json(brands);
    })
    .catch((err) => console.log(err));
});

//---------------------------------------------|
//             GET brand BY ID              |
//---------------------------------------------|
router.get(
  "/:brandID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (req.user.role !== "user") {
      brandModel
        .findOne({ _id: req.params.brandID })
        .populate("publisher", ["name"])
        .then((brand) => {
          return res.status(200).json(brand);
        })
        .catch((err) => console.log(err));
    }
  }
);

//---------------------------------------------|
//             ADD NEW BRAND                   |
//---------------------------------------------|
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //check for admin role
    if (req.user.role !== "user") {
      let { isValid, errors } = brandValidators(req.body);
      if (!isValid) {
        return res.status(400).json(errors);
      }

      brandModel.findOne({ name: req.body.name }).then((brand) => {
        if (brand) {
          let errors = {};
          errors.uniqueName = "Name must be unique";
          return res.status(400).json(errors);
        }

        let newBrandModel = new brandModel({
          name: req.body.name,
          description: req.body.description,
          publisher: req.user.id,
        });

        newBrandModel
          .save()
          .then((brand) => {
            brandModel.populate(
              newBrandModel,
              { path: "publisher", select: "name" },
              (err, brand) => {
                if (err) {
                  console.log(err);
                }
                res.status(201).json(brand);
              }
            );
          })
          .catch((err) => console.log(err));
      });
    } else {
      let errors = {};
      errors.userNotAdmin = "You are not have admin privilleges";
      return res.status(400).json(errors);
    }
  }
);

//---------------------------------------------|
//             EDIT BRAND BY ID              |
//---------------------------------------------|
//
// for only authenticated admins
//
router.put(
  "/:brandID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (req.user.role !== "user") {
      //check for validations
      let { isValid, errors } = brandValidators(req.body);
      if (!isValid) {
        return res.status(400).json(errors);
      }

      brandModel
        .findOne({ name: req.body.name })
        .then((cat) => {
          if (cat) {
            if (cat._id.toString() !== req.params.brandID) {
              let errors = {};
              errors.uniqueName = "Name must be unique";
              return res.status(400).json(errors);
            }
          }

          const newBrandModel = {
            name: req.body.name,
            description: req.body.description,
            brand: req.body.brand,
          };

          brandModel
            .findOneAndUpdate(
              { _id: req.params.brandID },
              { $set: newBrandModel },
              { new: true }
            )
            .populate("publisher", ["name"])
            .then((categ) => res.status(200).json(categ))
            .catch((err) => console.log(err));
        })
        .catch((err) => console.log(err));
    } else {
      let errors = {};
      errors.userNotAdmin = "You are not have admin privilleges";
      return res.status(400).json(errors);
    }
  }
);

//---------------------------------------------|
//             DELETE brand BY ID           |
//---------------------------------------------|
router.delete(
  "/:brandID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (req.user.role !== "user") {
      brandModel
        .findOneAndDelete({ _id: req.params.brandID }, { new: true })
        .then((cat) => {
          if (cat) {
            return res.status(200).json("done");
          }
          let errors = {};
          errors.brand = "There is no brand for this id";
          return res.status(400).json(errors);
        })
        .catch((err) => console.log(err));
    } else {
      let errors = {};
      errors.userNotAdmin = "You are not have admin privilleges";
      return res.status(400).json(errors);
    }
  }
);

module.exports = router;
