//---------------------------------------------|
//           All required modules              |
//---------------------------------------------|
const router = require("express").Router();
const stripe = require("stripe")("sk_test_dRGPlCrOt3QXSuOxSwhvT5cZ00xTVDsc19");
const { v4: uuidv4 } = require("uuid");

//---------------------------------------------|
//           test                |
//---------------------------------------------|
router.route("/pay").post(async (req, res, next) => {
  const { token, amount } = req.body;
  const idempotencyKey = uuidv4();

  const customer = await stripe.customers.create({
    email: token.email,
    source: token,
  });

  if (customer) {
    const charges = await stripe.charges.create(
      {
        amount: amount * 100,
        currency: "usd",
        customer: customer.id,
        receipt_email: token.email,
        description: `Your products {${req.body.cartProducts.map(
          (pro) => pro.name
        )}} and cost $${amount}`,
      },
      { idempotencyKey }
    );
    if (charges) {
      return res.status(200).json(charges);
    }
  }
  return customer;
});

////////////////////////
module.exports = router;
