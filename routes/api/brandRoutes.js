//---------------------------------------------|
//           All required modules              |
//---------------------------------------------|
const router = require("express").Router();
const passport = require("passport");
const {
  getAllBrands,
  getBrandById,
  addNewBrand,
  updateBrand,
  deleteBrandByID,
} = require("../../controllers/brandControllers");

//---------------------------------------------|
//             GET ALL BRANDS
//---------------------------------------------|

router.route("/").get(getAllBrands);

//---------------------------------------------|
//             GET brand BY ID
//---------------------------------------------|
router
  .route("/:brandID")
  .get(passport.authenticate("jwt", { session: false }), getBrandById),
  //---------------------------------------------|
  //             ADD NEW BRAND                   |
  //---------------------------------------------|
  router
    .route("/")
    .post(passport.authenticate("jwt", { session: false }), addNewBrand);

//---------------------------------------------|
//             EDIT BRAND BY ID              |
//---------------------------------------------|

router
  .route("/:brandID")
  .put(passport.authenticate("jwt", { session: false }), updateBrand);

//---------------------------------------------|
//             DELETE brand BY ID           |
//---------------------------------------------|
router
  .route("/:brandID")
  .delete(passport.authenticate("jwt", { session: false }), deleteBrandByID);

module.exports = router;
