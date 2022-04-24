//---------------------------------------------|
//           All required modules              |
//---------------------------------------------|
const express = require("express");
const router = express.Router();
const passport = require("passport");
const cartModel = require("../../models/cartModel");

//---------------------------------------------|
//             POST TEST POST                  |
//---------------------------------------------|
router.get("/test", (req, res) => res.json({ msg: "Cart Works" }));

//---------------------------------------------|
//            ADD PRODUCT TO CART              |
//---------------------------------------------|
router.post(
  "/addtocart",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const cartID = req.user.id;
    const price = req.body.price;
    const newProduct = {
      _id: req.body.id,
      name: req.body.name,
      price: req.body.price,
      qty: 1,
    };

    cartModel
      .findById({ _id: cartID })
      .then((cart) => {
        // if not cart exist
        if (!cart) {
          const newCartModel = new cartModel({
            _id: cartID,
            totalQty: 1,
            totalPrice: price,
            selectedProduct: [newProduct],
          });
          newCartModel.save((err, done) => {
            if (err) {
              console.log(err);
            }
            return res.status(201).json(done);
          });
        } else {
          const productIndex = cart.selectedProduct
            .map((c) => c._id)
            .indexOf(req.body.id);
          // if exist cart but this product not exist
          if (productIndex < 0) {
            cart.totalPrice += price;
            cart.totalQty += 1;
            cart.selectedProduct.push(newProduct);

            cartModel.findByIdAndUpdate(
              { _id: cartID },
              { $set: cart },
              { new: true },
              (err, done) => {
                if (err) {
                  console.log(err);
                }
                return res.status(201).json(done);
              }
            );
          } else {
            // if exist cart and product
            cart.selectedProduct[productIndex].price += price;
            cart.selectedProduct[productIndex].qty += 1;
            cart.totalPrice += price;
            cart.totalQty += 1;
            cartModel.findByIdAndUpdate(
              { _id: cartID },
              { $set: cart },
              { new: true },
              (err, done) => {
                if (err) {
                  console.log(err);
                }
                return res.status(201).json(done);
              }
            );
          }
        }
      })
      .catch((err) => console.log(err));
  }
);

//---------------------------------------------|
//             GET CART ITEMS                  |
//---------------------------------------------|
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    cartModel
      .findById({ _id: req.user.id })
      .then((cart) => {
        return res.status(200).json(cart);
      })
      .catch((err) => console.log(err));
  }
);

//---------------------------------------------|
//     INCREASE CART PRODUCT COUNT             |
//---------------------------------------------|
router.post(
  "/iqty",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const price = Number(req.body.price);
    const Index = req.body.index;
    cartModel.findById({ _id: req.user.id }, (err, cart) => {
      if (err) {
        console.log(err);
      }
      cart.totalQty += 1;
      cart.totalPrice += price;
      cart.selectedProduct[Index].qty += 1;
      cart.selectedProduct[Index].price += price;
      cartModel.findByIdAndUpdate(
        { _id: req.user.id },
        { $set: cart },
        { new: true },
        (err, done) => {
          if (err) {
            console.log(err);
          }
          return res.status(200).json(done);
        }
      );
    });
  }
);

//---------------------------------------------|
//     DECREASE CART PRODUCT COUNT             |
//---------------------------------------------|
router.post(
  "/dqty",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const price = Number(req.body.price);
    const Index = req.body.index;
    cartModel.findById({ _id: req.user.id }, (err, cart) => {
      if (err) {
        console.log(err);
      }
      cart.totalQty -= 1;
      cart.totalPrice -= price;
      cart.selectedProduct[Index].qty -= 1;
      cart.selectedProduct[Index].price -= price;
      cartModel.findByIdAndUpdate(
        { _id: req.user.id },
        { $set: cart },
        { new: true },
        (err, done) => {
          if (err) {
            console.log(err);
          }
          return res.status(200).json(done);
        }
      );
    });
  }
);

//---------------------------------------------|
//     INCREASE CART PRODUCT BY Value          |
//---------------------------------------------|
router.post(
  "/vqty",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const value = req.body.value;
    const price = req.body.price * value;
    const Index = req.body.index;

    cartModel.findById({ _id: req.user.id }, (err, cart) => {
      if (err) {
        console.log(err);
      }
      cart.totalQty += value;
      cart.totalPrice += price;
      cart.selectedProduct[Index].qty += value;
      cart.selectedProduct[Index].price += price;
      cartModel.findByIdAndUpdate(
        { _id: req.user.id },
        { $set: cart },
        { new: true },
        (err, done) => {
          if (err) {
            console.log(err);
          }
          return res.status(200).json(done);
        }
      );
    });
  }
);

//---------------------------------------------|
//              DELETE CART ITEM               |
//---------------------------------------------|
router.post(
  "/pro",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const Index = req.body.index;

    cartModel.findById({ _id: req.user.id }, (err, cart) => {
      if (err) {
        console.log(err);
      }

      cart.totalPrice -= cart.selectedProduct[Index].price;
      cart.totalQty -= cart.selectedProduct[Index].qty;
      cart.selectedProduct.splice(Index, 1);

      cartModel.findByIdAndUpdate(
        { _id: req.user.id },
        { $set: cart },
        { new: true },
        (err, done) => {
          if (err) {
            console.log(err);
          }
          return res.status(200).json(done);
        }
      );
    });
  }
);

//---------------------------------------------|
//                   CLAER CART                |
//---------------------------------------------|
router.post(
  "/clear",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    cartModel.findByIdAndDelete({ _id: req.user.id }, (err, cart) => {
      if (err) {
        console.log(err);
      }
      return res.status(200).json({ done: "alkhug" });
    });
  }
);

module.exports = router;
