//---------------------------------------------|
//           All required modules
//---------------------------------------------|
const express = require("express");
const router = express.Router();
const passport = require("passport");
const productModel = require("../../models/productModel");
const productValidators = require("../../validation/productValidators");
const multer = require("multer");
const fs = require("fs");
const isEmpty = require("../../validation/isEmpty");

//---------------------------------------------|
//           Image gallery setup
//---------------------------------------------|
const gallaryStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    let path;
    if (fs.existsSync("public/gallary/" + req.params.productID)) {
      console.log("exist");
      path = "public/gallary/" + req.params.productID;
    } else {
      path = fs.mkdirSync("public/gallary/" + req.params.productID, {
        recursive: true,
      });
    }
    cb(null, path);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.originalname + req.user.name + Date.now() + file.originalname
    );
  },
});

const uploadGalleryImages = multer({
  storage: gallaryStorage,
  limits: {
    fileSize: 1024 * 1024 * 3,
  },
  fileFilter: function (req, file, cb) {
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/jpg"
    ) {
      cb(null, true);
    } else {
      cb(new Error("You must choose jpg, png"), false);
    }
  },
});

//---------------------------------------------|
//           Image upload setup
//---------------------------------------------|
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let path;
    if (fs.existsSync("public/proImage/")) {
      path = "public/proImage/";
    } else {
      path = fs.mkdirSync("public/proImage/", { recursive: true });
    }
    cb(null, path);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.originalname + req.user.name + Date.now() + file.originalname
    );
  },
});

const uploadProImage = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    const fileSize = parseInt(req.headers["content-length"]);
    let { isValid, errors } = productValidators(req.body);
    let mime = file.mimetype;
    if (
      !(mime === "image/png" || mime === "image/jpeg" || mime === "image/jpg")
    ) {
      cb(new Error("You must choose jpg, png, jpeg"), false);
    } else if (req.user.role === "user") {
      cb(new Error("You are not have admin privilleges"), false);
    } else if (fileSize > 1024 * 1024 * 2) {
      cb(new Error("Image size must not exceed 2mb"), false);
    } else if (!isValid) {
      cb(new Error(Object.values(errors).map((error) => error)), false);
    } else {
      cb(null, true);
    }
  },
});

//---------------------------------------------|
//             GET ALL PRODUCTS
//---------------------------------------------|
router.get("/", (req, res) => {
  const { page } = req.query;
  const limit = 4;
  const skip = page * limit;
  productModel
    .find()
    .populate("publisher", ["name"])
    .limit(limit)
    .skip(parseInt(skip))
    .then((products) => {
      productModel.count().then((count) => {
        res.status(200).json({ count: Math.ceil(count / limit), products });
      });
    })
    .catch((err) => console.log(err));
});

//---------------------------------------------|
//      GET ALL PRODUCTS FOR ADMINS
//---------------------------------------------|
router.get("/admins", (req, res) => {
  productModel
    .find()
    .sort({ createdAt: -1 })
    .populate("publisher", ["name"])
    .then((products) => {
      productModel.count().then((count) => {
        res.status(200).json({ count, products });
      });
    })
    .catch((err) => console.log(err));
});

//---------------------------------------------|
//             GET PRODUCT BY ID
//---------------------------------------------|
router.get("/:productID", (req, res) => {
  productModel
    .findOne({ _id: req.params.productID })
    .populate("publisher", ["name"])
    .then((pro) => res.status(200).json(pro))
    .catch((err) => res.sendStatus(404));
});

//---------------------------------------------|
//      GET PRODUCTS BY CATEGORTY NAME
//---------------------------------------------|
router.get("/category/:categoryID", (req, res) => {
  const { page } = req.query;
  const limit = 4;
  const skip = page * limit;
  productModel
    .find({ category: req.params.categoryID })
    .populate("publisher", ["name"])
    .limit(limit)
    .skip(parseInt(skip))
    .then((products) => {
      productModel.count().then((count) => {
        res.status(200).json({ count: Math.ceil(count / limit), products });
      });
    })
    .catch((err) => console.log(err));
});

//---------------------------------------------|
//      GET PRODUCTS BY BRAND NAME
//---------------------------------------------|
router.get("/brand/:brandID", (req, res) => {
  let { page } = req.query;
  let limit = 2;
  let skip = page * limit;
  productModel
    .find({ brand: req.params.brandID })
    .populate("publisher", ["name"])
    .limit(limit)
    .skip(parseInt(skip))
    .then((products) => {
      productModel.count().then((count) => {
        res.status(200).json({ count: Math.ceil(count / limit), products });
      });
    })
    .catch((err) => console.log(err));
});

//---------------------------------------------|
//     GET PRODUCTS BY SPECIFIC FILTER
//---------------------------------------------|
router.post("/filter", function (req, res) {
  const { page } = req.query;
  const limit = 4;
  const skip = page * limit;
  const reqs = {};
  !isEmpty(req.body.category) ? (reqs.category = req.body.category) : "";
  !isEmpty(req.body.brand) ? (reqs.brand = req.body.brand) : "";
  reqs.price = { $lte: req.body.price[1], $gte: req.body.price[0] };

  productModel
    .find(reqs)
    .populate("publisher", ["name"])
    .limit(limit)
    .skip(skip)
    .then((products) => {
      productModel.count().then((count) => {
        res.status(200).json({ count: Math.ceil(count / limit), products });
      });
    })
    .catch((err) => console.log(err));
});
//////////////////////////////

//---------------------------------------------|
//     GET PRODUCTS BY SEARCH WORD
//---------------------------------------------|
router.post("/search", function (req, res) {
  const { page } = req.query;
  const limit = 4;
  const skip = page * limit;
  const search = req.body.search;
  productModel
    .find({ name: { $regex: ".*" + search + ".*", $options: "i" } })
    .populate("publisher", ["name"])
    .limit(limit)
    .skip(parseInt(skip))
    .then((products) => {
      productModel.count().then((count) => {
        res.status(200).json({ count: Math.ceil(count / limit), products });
      });
    })
    .catch((err) => console.log(err));
});
//////////////////////////////

//---------------------------------------------|
//             EDIT PRODUCT BY ID
//---------------------------------------------|
//
// for only authenticated admins
//
router.put(
  "/:productID",
  passport.authenticate("jwt", { session: false }),
  uploadProImage.single("productImage"),
  (err, req, res, next) => {
    if (err) {
      const errors = {};
      errors.ProductAvatar = err.message.split(",");
      return res.status(400).json(errors.ProductAvatar.map((err) => err));
    }
  },
  (req, res) => {
    if (req.user.role !== "user") {
      //check for validations
      const { isValid, errors } = productValidators(req.body);
      if (!isValid) {
        return res.status(400).json(errors);
      }

      productModel
        .findOne({ name: req.body.name })
        .then((pro) => {
          if (pro) {
            if (pro._id.toString() !== req.params.productID) {
              let errors = {};
              errors.uniqueName = "Name must be unique";
              return res.status(400).json(errors);
            }
          }

          const newProductModel = {
            name: `${req.body.name[0].toUpperCase()}${req.body.name.slice(1)}`,
            price: req.body.price,
            category: req.body.category,
            brand: req.body.brand,
          };

          if (req.file) {
            if (pro.productImage !== "noimage.png") {
              fs.unlink("public/proImage/" + pro.productImage, (err) => {
                if (err) {
                  console.log(err);
                }
              });
            }
            newProductModel.productImage = req.file.filename;
          }

          productModel
            .findOneAndUpdate(
              { _id: req.params.productID },
              { $set: newProductModel },
              { new: true }
            )
            .then((prod) => res.status(200).json(prod))
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
//             ADD NEW PRODUCT
//---------------------------------------------|
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),

  uploadProImage.single("productImage"),
  (err, req, res, next) => {
    if (err) {
      let errors = {};
      errors.ProductAvatar = err.message.split(",");
      return res.status(400).json(errors.ProductAvatar.map((err) => err));
    }
  },

  (req, res) => {
    if (req.user.role !== "user") {
      let { isValid, errors } = productValidators(req.body);
      if (!isValid) {
        return res.status(400).json(errors);
      }

      productModel.findOne({ name: req.body.name }).then((pro) => {
        if (pro) {
          let errors = {};
          errors.uniqueName = "Name must be unique";
          return res.status(400).json(errors);
        }

        const newProductModel = new productModel({
          name: `${req.body.name[0].toUpperCase()}${req.body.name.slice(1)}`,
          price: req.body.price,
          category: req.body.category,
          brand: req.body.brand,
          publisher: req.user.id,
        });

        if (req.file) {
          newProductModel.productImage = req.file.filename;
        }

        newProductModel
          .save()
          .then((pro) => res.status(201).json("done"))
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
//             DELETE PRODUCT BY ID
//---------------------------------------------|
router.delete(
  "/:productID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (req.user.role !== "user") {
      productModel
        .findOneAndDelete({ _id: req.params.productID }, { new: true })
        .then((pro) => {
          if (pro) {
            //delete image if not equal noimage.png
            if (pro.productImage != "noimage.png") {
              fs.unlink("public/proImage/" + pro.productImage, (err) => {
                if (err) {
                  console.log(err);
                }
              });
            }

            //delete product gallary if exists
            if (fs.existsSync(`public/gallary/${req.params.productID}`)) {
              fs.rm(
                `public/gallary/${req.params.productID}`,
                { recursive: true },
                (err) => {
                  if (err) {
                    console.log(err);
                  }
                }
              );
            }

            return res.status(200).json("done");
          }
          let errors = {};
          errors.product = "There is no product for this id";
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

//---------------------------------------------|
//     SORT PRODUCTS BY PRODUCT NAME ASC
//---------------------------------------------|
router.get("/sort/:sorted/:number", (req, res) => {
  let { page } = req.query;
  let limit = 4;
  let skip = page * limit;

  productModel
    .find()
    .sort({ [req.params.sorted]: req.params.number === "true" ? 1 : -1 })
    .populate("publisher", ["name"])
    .limit(limit)
    .skip(skip)
    .then((products) => {
      productModel.count().then((count) => {
        res.status(200).json({ count: Math.ceil(count / limit), products });
      });
    })
    .catch((err) => console.log(err));
});

//---------------------------------------------|
//            Upload gallary images
//---------------------------------------------|
router.post(
  "/gallary/:productID",
  passport.authenticate("jwt", { session: false }),
  uploadGalleryImages.array("gallary"),
  (err, req, res, next) => {
    if (err) return console.log(err.message);
  },
  (req, res) => {
    productModel.findOneAndUpdate(
      { _id: req.params.productID },
      {
        $push: {
          productGallary: { $each: req.files.map((file) => file.filename) },
        },
      },
      { new: true },
      (err, done) => {
        if (err) return console.log(err);
        res.status(200).json(done);
      }
    );
  }
);

//---------------------------------------------|
//            DELETE GALLARY IMAGES
//---------------------------------------------|
router.delete(
  "/gallary/:productID/:img",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    productModel.findByIdAndUpdate(
      { _id: req.params.productID },
      { $pull: { productGallary: req.params.img } },
      { new: true },
      (err, product) => {
        if (err) {
          console.log(err);
        }
        fs.unlink(
          `public/gallary/${req.params.productID}/${req.params.img}`,
          (err) => {
            if (err) {
              console.log(err);
            }
          }
        );
        return res.status(200).json(product);
      }
    );
  }
);

module.exports = router;
