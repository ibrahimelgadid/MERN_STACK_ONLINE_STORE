//---------------------------------------------|
//           All required modules
//---------------------------------------------|
const asyncHandler = require("express-async-handler");
const orderModel = require("../models/orderModel");

//---------------------------------------------|
//           POST NEW ORDER
//---------------------------------------------|
const addNewOrder = asyncHandler(async (req, res) => {
  const { isValid, errors } = orderValidators(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const cart = await cartModel.findById({ _id: req.user.id });
  if (cart.totalQty > 0) {
    const newOrderModel = new orderModel({
      orderOwner: req.user.id,
      cart,
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address,
      address2: req.body.address2,
    });
    const newOrder = await newOrderModel.save();
    if (newOrder) {
      await cartModel.deleteOne({ _id: req.user.id });
      return res.status(200).json("order");
    }
  } else {
    return res.status(400).json({ noCartItems: "Cart has no items" });
  }
});

//---------------------------------------------|
//           GET ALL ORDERS fOR ADMIN
//---------------------------------------------|
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await orderModel.find().populate("orderOwner", "name");
  return res.status(200).json(orders);
});

//---------------------------------------------|
//          GET ALL ORDERS fOR USER
//---------------------------------------------|
const getAllOrdersForUsers = asyncHandler(async (req, res) => {
  const orders = await orderModel
    .find({ orderOwner: req.user.id })
    .populate("orderOwner", "name");
  return res.status(200).json(orders);
});

//---------------------------------------------|
//               GET ORDER BY ID
//---------------------------------------------|
const getOrderId = asyncHandler(async (req, res) => {
  const order = await orderModel
    .findOne({ _id: req.params.orderID })
    .populate("orderOwner", "name");
  return res.status(200).json(order);
});

//---------------------------------------------|
//               UPDATE ORDER BY ID
//---------------------------------------------|
const updatedOrder = asyncHandler(async (req, res) => {
  const updatedOrder = await orderModel
    .findOneAndUpdate(
      { _id: req.body.orderID },
      { $set: { status: req.body.status } },
      { new: true }
    )
    .populate("orderOwner", "name");
  return res.status(200).json(updatedOrder);
});

//---------------------------------------------|
//              DELETE ORDER
//---------------------------------------------|
const deleteOrder = asyncHandler(async (req, res) => {
  const order = await orderModel.deleteOne({ _id: req.body.order_id });
  return res.status(200).json(order);
});
// export modules
module.exports = {
  addNewOrder,
  getAllOrders,
  getAllOrdersForUsers,
  getOrderId,
  updatedOrder,
  deleteOrder,
};
