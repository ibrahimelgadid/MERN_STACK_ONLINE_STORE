//---------------------------------------------|
//           All required modules
//---------------------------------------------|
const router = require("express").Router();
const passport = require("passport");
const {
  addNewOrder,
  getAllOrders,
  getAllOrdersForUsers,
  getOrderId,
  updatedOrder,
  deleteOrder,
} = require("../../controllers/orderControllers");
const orderModel = require("../../models/orderModel");

//---------------------------------------------|
//              POST NEW ORDER
//---------------------------------------------|
router
  .route("/")
  .post(passport.authenticate("jwt", { session: false }), addNewOrder);

//---------------------------------------------|
//         GET ALL ORDERS fOR ADMIN
//---------------------------------------------|
router
  .route("/admins")
  .get(passport.authenticate("jwt", { session: false }), getAllOrders);

//---------------------------------------------|
//          GET ALL ORDERS fOR USER
//---------------------------------------------|
router
  .route("/")
  .get(passport.authenticate("jwt", { session: false }), getAllOrdersForUsers);

//---------------------------------------------|
//               GET ORDER BY ID
//---------------------------------------------|
router
  .route("/:orderID")
  .get(passport.authenticate("jwt", { session: false }), getOrderId);

//---------------------------------------------|
//               UPDATE ORDER BY ID
//---------------------------------------------|
router
  .route("/")
  .put(passport.authenticate("jwt", { session: false }), updatedOrder);

//---------------------------------------------|
//              DELETE ORDER
//---------------------------------------------|
router
  .route("/delete")
  .post(passport.authenticate("jwt", { session: false }), deleteOrder);

module.exports = router;
