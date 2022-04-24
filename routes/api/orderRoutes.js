//---------------------------------------------|
//           All required modules              |
//---------------------------------------------|
const express = require("express");
const router = express.Router();
const passport = require("passport");
const orderModel = require("../../models/orderModel");
const cartModel = require("../../models/cartModel");
const orderValidators = require("../../validation/orderValidators");

//---------------------------------------------|
//              POST NEW ORDER                 |
//---------------------------------------------|
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { isValid, errors } = orderValidators(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    cartModel.findById({ _id: req.user.id }).then((cart) => {
      if (cart.totalQty > 0) {
        let newOrderModel = new orderModel({
          orderOwner: req.user.id,
          cart,
          name: req.body.name,
          email: req.body.email,
          phone: req.body.phone,
          address: req.body.address,
          address2: req.body.address2,
        });
        newOrderModel.save((err, order) => {
          if (err) {
            console.log(err);
          }
          cartModel.deleteOne({ _id: req.user.id }, (err, done) => {
            if (err) {
              console.log(err);
            }
            return res.status(200).json(order);
          });
        });
      } else {
        return res.status(400).json({ noCartItems: "Cart has no items" });
      }
    });
  }
);

//---------------------------------------------|
//         GET ALL ORDERS fOR ADMIN            |
//---------------------------------------------|
router.get(
  "/admins",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    orderModel
      .find()
      .populate("orderOwner", "name")
      .then((orders) => {
        return res.status(200).json(orders);
      })
      .catch((err) => sendStatus(404));
  }
);

//---------------------------------------------|
//          GET ALL ORDERS fOR USER            |
//---------------------------------------------|
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    orderModel
      .find({ orderOwner: req.user.id })
      .populate("orderOwner", "name")
      .then((orders) => {
        return res.status(200).json(orders);
      })
      .catch((err) => sendStatus(404));
  }
);

//---------------------------------------------|
//               GET ORDER BY ID               |
//---------------------------------------------|
router.get(
  "/:orderID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    orderModel
      .findOne({ _id: req.params.orderID })
      .populate("orderOwner", "name")
      .then((order) => {
        return res.status(200).json(order);
      })
      .catch((err) => res.sendStatus(404));
  }
);

//---------------------------------------------|
//               GET ORDER BY ID               |
//---------------------------------------------|
router.put(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    orderModel
      .findOneAndUpdate(
        { _id: req.body.orderID },
        { $set: { status: req.body.status } },
        { new: true }
      )
      .populate("orderOwner", "name")
      .then((order) => {
        return res.status(200).json(order);
      })
      .catch((err) => console.log(err));
  }
);

//---------------------------------------------|
//              DELETE ORDER                   |
//---------------------------------------------|
router.post(
  "/delete",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    orderModel
      .deleteOne({ _id: req.body.order_id })
      .then((order) => {
        return res.status(200).json(order);
      })
      .catch((err) => console.log(err));
  }
);

module.exports = router;
