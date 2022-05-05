//---------------------------------------------|
//           All required modules
//---------------------------------------------|
const cartModel = require("../models/cartModel");
const asyncHandler = require("express-async-handler");

//---------------------------------------------|
//           ADD PRODUCT TO CART
//---------------------------------------------|
const addToCart = asyncHandler(async (req, res) => {
  const cartID = req.user.id;
  const price = req.body.price;
  const newProduct = {
    _id: req.body.id,
    name: req.body.name,
    price: req.body.price,
    qty: 1,
  };

  const existsCart = await cartModel.findById({ _id: cartID });
  if (!existsCart) {
    const newCartModel = new cartModel({
      _id: cartID,
      totalQty: 1,
      totalPrice: price,
      selectedProduct: [newProduct],
    });
    const newCartItem = await newCartModel.save();
    return res.status(201).json(newCartItem);
  } else {
    const productIndex = existsCart.selectedProduct
      .map((c) => c._id)
      .indexOf(req.body.id);
    // if exist cart but this product not exist
    if (productIndex < 0) {
      existsCart.totalPrice += price;
      existsCart.totalQty += 1;
      existsCart.selectedProduct.push(newProduct);

      const updatedCartProductNotExist = await cartModel.findByIdAndUpdate(
        { _id: cartID },
        { $set: existsCart },
        { new: true }
      );

      return res.status(201).json(updatedCartProductNotExist);
    } else {
      // if exist cart and product
      existsCart.selectedProduct[productIndex].price += price;
      existsCart.selectedProduct[productIndex].qty += 1;
      existsCart.totalPrice += price;
      existsCart.totalQty += 1;
      const updatedCartProductExist = await cartModel.findByIdAndUpdate(
        { _id: cartID },
        { $set: existsCart },
        { new: true }
      );

      return res.status(201).json(updatedCartProductExist);
    }
  }
});

//---------------------------------------------|
//           GET CART ITEMS
//---------------------------------------------|
const getCartItems = asyncHandler(async (req, res) => {
  const cartItems = await cartModel.findById({ _id: req.user.id });
  return res.status(200).json(cartItems);
});
//---------------------------------------------|
//           INCREASE CART PRODUCT COUNT
//---------------------------------------------|
const increaseCartItemCount = asyncHandler(async (req, res) => {
  const price = Number(req.body.price);
  const Index = req.body.index;
  const cart = await cartModel.findById({ _id: req.user.id });
  cart.totalQty += 1;
  cart.totalPrice += price;
  cart.selectedProduct[Index].qty += 1;
  cart.selectedProduct[Index].price += price;
  const updatedCart = await cartModel.findByIdAndUpdate(
    { _id: req.user.id },
    { $set: cart },
    { new: true }
  );

  return res.status(200).json(updatedCart);
});
//---------------------------------------------|
//           DECREASE CART PRODUCT COUNT
//---------------------------------------------|
const decreaseCartItemCount = asyncHandler(async (req, res) => {
  const price = Number(req.body.price);
  const Index = req.body.index;
  const cart = await cartModel.findById({ _id: req.user.id });
  cart.totalQty -= 1;
  cart.totalPrice -= price;
  cart.selectedProduct[Index].qty -= 1;
  cart.selectedProduct[Index].price -= price;
  const updatedCart = await cartModel.findByIdAndUpdate(
    { _id: req.user.id },
    { $set: cart },
    { new: true }
  );

  return res.status(200).json(updatedCart);
});
//---------------------------------------------|
//           DELETE CART ITEM
//---------------------------------------------|
const deleteCartItem = asyncHandler(async (req, res) => {
  const Index = req.body.index;

  const cart = await cartModel.findById({ _id: req.user.id });
  if (cart) {
    cart.totalPrice -= cart.selectedProduct[Index].price;
    cart.totalQty -= cart.selectedProduct[Index].qty;
    cart.selectedProduct.splice(Index, 1);

    const deletedCartItem = await cartModel.findByIdAndUpdate(
      { _id: req.user.id },
      { $set: cart },
      { new: true }
    );
    return res.status(200).json(deletedCartItem);
  }
});
//---------------------------------------------|
//           CLEAR CART
//---------------------------------------------|
const clearCart = asyncHandler(async (req, res) => {
  const clearedCart = await cartModel.findByIdAndDelete({ _id: req.user.id });

  return res.status(200).json(clearedCart);
});

// export modules
module.exports = {
  addToCart,
  getCartItems,
  increaseCartItemCount,
  decreaseCartItemCount,
  deleteCartItem,
  clearCart,
};
