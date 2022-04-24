//---------------------------------------------|
//           All required modules              |
//---------------------------------------------|
const express = require("express");
const router = express.Router();
const passport = require("passport");
const categoryModel = require("../../models/categoryModel");
const categoryValidators = require("../../validation/categoryValidators");

//---------------------------------------------|
//             POST TEST CATEGORIES            |
//---------------------------------------------|
router.get("/test", (req, res) => res.json({ msg: "Categories Works" }));

//---------------------------------------------|
//             ADD NEW CATEGORY                |
//---------------------------------------------|
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //check for admin role
    if (req.user.role !== "user") {
      let { isValid, errors } = categoryValidators(req.body);
      if (!isValid) {
        return res.status(400).json(errors);
      }

      categoryModel.findOne({ name: req.body.name }).then((category) => {
        if (category) {
          let errors = {};
          errors.uniqueName = "Name must be unique";
          return res.status(400).json(errors);
        }

        let newcategoryModel = new categoryModel({
          name: req.body.name,
          description: req.body.description,
          publisher: req.user.id,
        });

        newcategoryModel
          .save()
          .then((category) => {
            categoryModel.populate(
              newcategoryModel,
              { path: "publisher", select: "name" },
              (err, category) => {
                if (err) {
                  console.log(err);
                }
                res.status(201).json(category);
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
//             EDIT CATEGORY BY ID              |
//---------------------------------------------|
//
// for only authenticated admins
//
router.put(
  "/:categoryID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (req.user.role !== "user") {
      //check for validations
      let { isValid, errors } = categoryValidators(req.body);
      if (!isValid) {
        return res.status(400).json(errors);
      }

      categoryModel
        .findOne({ name: req.body.name })
        .then((cat) => {
          if (cat) {
            if (cat._id.toString() !== req.params.categoryID) {
              let errors = {};
              errors.uniqueName = "Name must be unique";
              return res.status(400).json(errors);
            }
          }

          const newcategoryModel = {
            name: req.body.name,
            description: req.body.description,
            category: req.body.category,
          };

          categoryModel
            .findOneAndUpdate(
              { _id: req.params.categoryID },
              { $set: newcategoryModel },
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
//             GET ALL CATEGORIES              |
//---------------------------------------------|
router.get("/", (req, res) => {
  categoryModel
    .find()
    .populate("publisher", ["name"])
    .then((categories) => {
      return res.status(200).json(categories);
    })
    .catch((err) => console.log(err));
});

//---------------------------------------------|
//             GET CATEGORY BY ID              |
//---------------------------------------------|
router.get(
  "/:categoryID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (req.user.role !== "user") {
      categoryModel
        .findOne({ _id: req.params.categoryID })
        .populate("publisher", ["name"])
        .then((category) => {
          return res.status(200).json(category);
        })
        .catch((err) => console.log(err));
    }
  }
);

//---------------------------------------------|
//             DELETE CATEGORY BY ID           |
//---------------------------------------------|
router.delete(
  "/:categoryID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (req.user.role !== "user") {
      categoryModel
        .findOneAndDelete({ _id: req.params.categoryID }, { new: true })
        .then((cat) => {
          if (cat) {
            return res.status(200).json("done");
          }
          let errors = {};
          errors.category = "There is no category for this id";
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
