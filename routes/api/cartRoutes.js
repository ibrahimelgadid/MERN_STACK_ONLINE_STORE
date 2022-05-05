//---------------------------------------------|
//           All required modules              |
//---------------------------------------------|
const router = require("express").Router();
const passport = require("passport");
const {
  addToCart,
  getCartItems,
  decreaseCartItemCount,
  increaseCartItemCount,
  deleteCartItem,
  clearCart,
} = require("../../controllers/cartControllers");

//---------------------------------------------|
//            ADD PRODUCT TO CART
//---------------------------------------------|
router
  .route("/addtocart")
  .post(passport.authenticate("jwt", { session: false }), addToCart);

//---------------------------------------------|
//             GET CART ITEMS
//---------------------------------------------|
router
  .route("/")
  .get(passport.authenticate("jwt", { session: false }), getCartItems);

//---------------------------------------------|
//     INCREASE CART PRODUCT COUNT
//---------------------------------------------|
router
  .route("/iqty")
  .post(
    passport.authenticate("jwt", { session: false }),
    increaseCartItemCount
  );

//---------------------------------------------|
//     DECREASE CART PRODUCT COUNT             |
//---------------------------------------------|
router
  .route("/dqty")
  .post(
    passport.authenticate("jwt", { session: false }),
    decreaseCartItemCount
  );

//---------------------------------------------|
//              DELETE CART ITEM               |
//---------------------------------------------|
router
  .route("/pro")
  .post(passport.authenticate("jwt", { session: false }), deleteCartItem);

//---------------------------------------------|
//                   CLAER CART                |
//---------------------------------------------|
router
  .route("/clear")
  .post(passport.authenticate("jwt", { session: false }), clearCart);

module.exports = router;
