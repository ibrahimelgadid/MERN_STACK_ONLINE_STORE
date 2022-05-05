//---------------------------------------------|
//           All required modules
//---------------------------------------------|
const router = require("express").Router();
const passport = require("passport");
const upload = require("../../helpers/imgUpload");
const {
  editProduct,
  getProductById,
  addNewProduct,
  deleteProduct,
  getProductsForAdmins,
  getAllProductsForUsers,
  getProductsBySearch,
  getProductsByFilter,
  sortProducts,
  uploadGallaryImages,
  deleteGallaryImage,
} = require("../../controllers/productsControllers");

//---------------------------------------------|
//             GET ALL PRODUCTS FOR USERS
//---------------------------------------------|
router.route("/").get(getAllProductsForUsers);

//---------------------------------------------|
//      GET ALL PRODUCTS FOR ADMINS
//---------------------------------------------|
router.route("/admins").get(getProductsForAdmins);

//---------------------------------------------|
//             GET PRODUCT BY ID
//---------------------------------------------|
router.route("/:productID").get(getProductById);

//---------------------------------------------|
//     GET PRODUCTS BY SPECIFIC FILTER
//---------------------------------------------|
router.route("/filter").post(getProductsByFilter);

//////////////////////////////

//---------------------------------------------|
//     GET PRODUCTS BY SEARCH WORD
//---------------------------------------------|
router.route("/search").post(getProductsBySearch);

//---------------------------------------------|
//             ADD NEW PRODUCT
//---------------------------------------------|
router.route("/").post(
  passport.authenticate("jwt", { session: false }),

  upload("public/proImage/").single("productImage"),
  (err, req, res, next) => {
    if (err) {
      const errors = {};
      errors.userAvatar = err.message;
      return res.status(400).json(errors);
    }
    next();
  },

  addNewProduct
);

//---------------------------------------------|
//             EDIT PRODUCT BY ID
//---------------------------------------------|
//
// for only authenticated admins
//
router.route("/:productID").put(
  passport.authenticate("jwt", { session: false }),
  upload("public/proImage/").single("productImage"),
  (err, req, res, next) => {
    if (err) {
      const errors = {};
      errors.userAvatar = err.message;
      return res.status(400).json(errors);
    }
    next();
  },
  editProduct
);

//---------------------------------------------|
//             DELETE PRODUCT BY ID
//---------------------------------------------|
router
  .route("/:productID")
  .delete(passport.authenticate("jwt", { session: false }), deleteProduct);

//---------------------------------------------|
//     SORT PRODUCTS BY PRODUCT NAME ASC
//---------------------------------------------|
router.route("/sort/:sorted/:number").get(sortProducts);

//---------------------------------------------|
//            Upload gallary images
//---------------------------------------------|
router.route("/gallary/:productID").post(
  passport.authenticate("jwt", { session: false }),
  upload("public/gallary/", "productID").array("gallary"),
  (err, req, res, next) => {
    if (err) return console.log(err.message);
  },
  uploadGallaryImages
);

//---------------------------------------------|
//            DELETE GALLARY IMAGES
//---------------------------------------------|
router
  .route("/gallary/:productID/:img")
  .delete(passport.authenticate("jwt", { session: false }), deleteGallaryImage);

module.exports = router;
