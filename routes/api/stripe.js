//---------------------------------------------|
//           All required modules              |
//---------------------------------------------|
const express = require('express');
const router = express.Router();
const stripe = require('stripe')('sk_test_dRGPlCrOt3QXSuOxSwhvT5cZ00xTVDsc19');
const {v4: uuidv4} = require('uuid')



//---------------------------------------------|
//           test                |
//---------------------------------------------|
router.post('/pay', (req,res,next)=>{
  const {token, amount} = req.body;
  const idempotencyKey = uuidv4();
  
  console.log(req.body.token);
  console.log(req.body.amount);
  return stripe.customers.create({
    email:token.email,
    source:token
  }).then((customer) => {
    stripe.charges.create({
      amount:amount*100,
      currency:'usd',
      customer:customer.id,
      receipt_email:token.email,
      description:`Your products {${req.body.cartProducts.map(pro=>pro.name)}} and cost $${amount}`
    }, {idempotencyKey})
    
  }).then((result) => {
    res.status(200).json(result)
  }).catch(err=>{
    console.log(err);
  })

})

////////////////////////
module.exports = router;