//---------------------------------------------|
//           All required modules
//---------------------------------------------|
const { notOwner } = require("../helpers/privilleges");
const productModel = require("../models/productModel");
const productValidators = require("../validation/productValidators");
const asyncHandler = require("express-async-handler");
const fs = require("fs");
const cleanName = require("../helpers/namesFuns");
const isEmpty = require("../validation/isEmpty");

//---------------------------------------------|
//           GET PRODUCTS FOR ADMINS
//---------------------------------------------|
const getProductsForAdmins = asyncHandler(async (req, res) => {
  const products = await productModel
    .find()
    .sort({
      createdAt: -1,
    })
    .populate("publisher", ["name"]);
  const productsCount = await productModel.count();
  res.status(200).json({
    productsCount,
    products,
  });
});

//---------------------------------------------|
//           GET PRODUCT BY ID
//---------------------------------------------|
const getProductById = asyncHandler(async (req, res) => {
  const product = await productModel
    .findOne({
      _id: req.params.productID,
    })
    .populate("publisher", ["name"]);
  res.status(200).json(product);
});

//---------------------------------------------|
//           GET PRODUCTS FOR USERS
//---------------------------------------------|
const getAllProductsForUsers = asyncHandler(async (req, res) => {
  const page = req.query.page ? req.query.page : 1;
  const limit = 2;
  const skip = (page - 1) * limit;

  const products = await productModel
    .find()
    .populate("publisher", ["name"])
    .limit(limit)
    .skip(parseInt(skip));
  const count = await productModel.count();
  res.status(200).json({
    count: Math.ceil(count / limit),
    products,
  });
});

//---------------------------------------------|
//           GET PRODUCTS BY SEARCH
//---------------------------------------------|
const getProductsBySearch = asyncHandler(async (req, res) => {
  const page = req.query.page ? req.query.page : 1;
  const search = req.query.search;
  const limit = 2;
  const skip = (page - 1) * limit;
  const queries = {
    name: {
      $regex: search,
      $options: "i",
    },
  };
  const products = await productModel
    .find(queries)
    .populate("publisher", "-password")
    .limit(limit)
    .skip(parseInt(skip));

  const count = await productModel.count(queries);

  res.status(200).json({
    count: Math.ceil(count / limit),
    products,
  });
});

//---------------------------------------------|
//           GET PRODUCTS BY FILTER
//---------------------------------------------|
const getProductsByFilter = asyncHandler(async (req, res) => {
  const page = req.query.page ? req.query.page : 1;
  const limit = 2;
  const skip = (page - 1) * limit;
  const queries = {};
  !isEmpty(req.body.category) ? (queries.category = req.body.category) : "";
  !isEmpty(req.body.brand) ? (queries.brand = req.body.brand) : "";
  queries.price = { $lte: req.body.price[1], $gte: req.body.price[0] };

  const products = await productModel
    .find(queries)
    .populate("publisher", ["name"])
    .limit(limit)
    .skip(parseInt(skip));
  const count = await productModel.count(queries).then((count) => {
    res.status(200).json({ count: Math.ceil(count), products });
  });
});

//---------------------------------------------|
//           SORT PRODUCTS
//---------------------------------------------|
const sortProducts = asyncHandler(async (req, res) => {
  const { page } = req.query;
  const limit = 4;
  const skip = page * limit;

  const products = await productModel
    .find()
    .sort({ [req.params.sorted]: req.params.number === "true" ? 1 : -1 })
    .populate("publisher", ["name"])
    .limit(limit)
    .skip(skip);
  const count = await productModel.count();
  res.status(200).json({ count: Math.ceil(count / limit), products });
});
//---------------------------------------------|
//           ADD PRODUCT
//---------------------------------------------|
const addNewProduct = asyncHandler(async (req, res) => {
  // check if product owner
  const { isValid, errors } = productValidators(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const existsName = await productModel.findOne({
    name: cleanName(req.body.name),
  });
  if (existsName) {
    const errors = {};
    errors.name = "Name must be unique";
    return res.status(400).json(errors);
  }

  const newProductModel = new productModel({
    name: cleanName(req.body.name),
    price: req.body.price,
    category: req.body.category,
    brand: req.body.brand,
    publisher: req.user.id,
  });

  if (req.file) {
    newProductModel.productImage = req.file.filename;
  }

  await newProductModel.save();
  res.status(201).json("done");
});

//---------------------------------------------|
//           EDIT PRODUCT
//---------------------------------------------|
const editProduct = asyncHandler(async (req, res) => {
  // check if product owner
  const product = await productModel.findById(req.params.productID);
  if (!notOwner(req, res, product.publisher, "product")) {
    //check for validations
    const { isValid, errors } = productValidators(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }

    //check for unique name
    const productExists = await productModel.findOne({
      $and: [
        {
          name: cleanName(req.body.name),
        },
        {
          _id: {
            $ne: req.params.productID,
          },
        },
      ],
    });
    if (productExists) {
      const errors = {};
      errors.name = "Name must be unique";
      return res.status(400).json(errors);
    }

    //new product object
    const newProductModel = {
      name: cleanName(req.body.name),
      price: req.body.price,
      category: req.body.category,
      brand: req.body.brand,
    };

    //delete old image and store new one
    if (req.file) {
      if (product.productImage !== "noimage.png") {
        fs.unlink("public/proImage/" + product.productImage, (err) => {
          if (err) {
            console.log(err);
          }
        });
      }
      newProductModel.productImage = req.file.filename;
    }

    //update data
    const updatedProduct = await productModel.findOneAndUpdate(
      {
        _id: req.params.productID,
      },
      {
        $set: newProductModel,
      },
      {
        new: true,
      }
    );
    res.status(200).json(updatedProduct);
  }
});

//---------------------------------------------|
//           DELETE PRODUCT
//---------------------------------------------|
const deleteProduct = asyncHandler(async (req, res) => {
  // check if product owner
  const product = await productModel.findById(req.params.productID);
  if (!notOwner(req, res, product.publisher, "product")) {
    const updatedProduct = await productModel.findOneAndDelete(
      {
        _id: req.params.productID,
      },
      {
        new: true,
      }
    );
    if (updatedProduct) {
      //delete image if not equal noimage.png
      if (updatedProduct.productImage != "noimage.png") {
        fs.unlink("public/proImage/" + updatedProduct.productImage, (err) => {
          if (err) {
            console.log(err);
          }
        });
      }

      //delete product gallary if exists
      if (fs.existsSync(`public/gallary/${req.params.productID}`)) {
        fs.rm(
          `public/gallary/${req.params.productID}`,
          {
            recursive: true,
          },
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
  }
});

//---------------------------------------------|
//           UPLOAD PRODUCT GALLARY
//---------------------------------------------|
const uploadGallaryImages = asyncHandler(async (req, res) => {
  const updatedProducts = await productModel.findOneAndUpdate(
    { _id: req.params.productID },
    {
      $push: {
        productGallary: { $each: req.files.map((file) => file.filename) },
      },
    },
    { new: true }
  );
  res.status(200).json(updatedProducts);
});

//---------------------------------------------|
//           DELETE IMAGES FROM GALLARY
//---------------------------------------------|
const deleteGallaryImage = asyncHandler(async (req, res) => {
  const updatedProducts = await productModel.findByIdAndUpdate(
    { _id: req.params.productID },
    { $pull: { productGallary: req.params.img } },
    { new: true }
  );

  await fs.promises.unlink(
    `public/gallary/${req.params.productID}/${req.params.img}`
  );
  return res.status(200).json(updatedProducts);
});
// export modules
module.exports = {
  getAllProductsForUsers,
  getProductsForAdmins,
  getProductById,
  getProductsBySearch,
  getProductsByFilter,
  sortProducts,
  addNewProduct,
  editProduct,
  deleteProduct,
  uploadGallaryImages,
  deleteGallaryImage,
};
