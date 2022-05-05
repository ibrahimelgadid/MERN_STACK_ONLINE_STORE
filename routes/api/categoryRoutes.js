//---------------------------------------------|
//           All required modules              |
//---------------------------------------------|
const router = require("express").Router();
const passport = require("passport");
const {
  getAllCategories,
  getCategoryById,
  addNewCategory,
  updateCategory,
  deleteCategoryByID,
} = require("../../controllers/categoryControllers");

//---------------------------------------------|
//             GET ALL CATEGORIES
//---------------------------------------------|

router.route("/").get(getAllCategories);

//---------------------------------------------|
//             GET CATEGORY BY ID
//---------------------------------------------|
router
  .route("/:categoryID")
  .get(passport.authenticate("jwt", { session: false }), getCategoryById),
  //---------------------------------------------|
  //             ADD NEW CATEGORY                   |
  //---------------------------------------------|
  router
    .route("/")
    .post(passport.authenticate("jwt", { session: false }), addNewCategory);

//---------------------------------------------|
//             EDIT CATEGORY BY ID              |
//---------------------------------------------|

router
  .route("/:categoryID")
  .put(passport.authenticate("jwt", { session: false }), updateCategory);

//---------------------------------------------|
//             DELETE CATEGORY BY ID           |
//---------------------------------------------|
router
  .route("/:categoryID")
  .delete(passport.authenticate("jwt", { session: false }), deleteCategoryByID);

module.exports = router;
