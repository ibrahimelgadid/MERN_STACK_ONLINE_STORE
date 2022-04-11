//---------------------------------------------|
//           All required modules              |
//---------------------------------------------|
const express = require('express');
const router = express.Router();
const passport = require('passport');
const Order = require('../../models/Order');
const Cart = require('../../models/Cart');
const OrdersErrors = require('../../validation/orders');




//---------------------------------------------|
//              POST NEW ORDER                 |
//---------------------------------------------|
router.post('/', passport.authenticate('jwt', {session:false}),(req, res) => {
  let {isValid, errors} = OrdersErrors(req.body)

  if(!isValid){
    return res.status(400).json(errors)
  }
  
  Cart.findById({_id:req.user.id})
  .then(cart=>{
    if(cart.totalQty>0){
      let newOrder = new Order({
        orderOwner:req.user.id,
        cart,
        name:req.body.name,
        email:req.body.email,
        phone:req.body.phone,
        address:req.body.address,
        address2:req.body.address2,     
      })
      newOrder.save((err, order)=>{
        if (err) {console.log(err)}
        Cart.deleteOne({_id:req.user.id},(err,done)=>{
            if(err){console.log(err);}
            return res.status(200).json(order)
        })
      })
    }else{
      return res.status(400).json({noCartItems:'Cart has no items'})
    }
  })
});



//---------------------------------------------|
//         GET ALL ORDERS fOR ADMIN            |
//---------------------------------------------|
router.get('/admins', passport.authenticate('jwt', {session:false}),(req, res) => {
  Order.find()
  .populate('orderOwner', 'name')
  .then(orders=>{
    return res.status(200).json(orders)
  }).catch(err=>sendStatus(404))
});


//---------------------------------------------|
//          GET ALL ORDERS fOR USER            |
//---------------------------------------------|
router.get('/', passport.authenticate('jwt', {session:false}),(req, res) => {
  Order.find({orderOwner:req.user.id})
  .populate('orderOwner', 'name')
  .then(orders=>{
    return res.status(200).json(orders)
  }).catch(err=>sendStatus(404))
});


//---------------------------------------------|
//               GET ORDER BY ID               |
//---------------------------------------------|
router.get('/:orderId', passport.authenticate('jwt', {session:false}),(req, res) => {
  Order.findOne({_id:req.params.orderId})
  .populate('orderOwner', 'name')
  .then(order=>{
    return res.status(200).json(order)
  }).catch(err=>res.sendStatus(404))
});



//---------------------------------------------|
//               GET ORDER BY ID               |
//---------------------------------------------|
router.put('/', passport.authenticate('jwt', {session:false}),(req, res) => {
  Order.findOneAndUpdate(
    {_id:req.body.orderId},
    {$set:{status:req.body.status}},
    {new:true}
  )
  .populate('orderOwner', 'name')
  .then(order=>{
    return res.status(200).json(order)
  }).catch(err=>console.log(err))
});



//---------------------------------------------|
//              DELETE ORDER                   |
//---------------------------------------------|
router.post('/delete', passport.authenticate('jwt', {session:false}),(req, res) => {
  Order.deleteOne({_id:req.body.order_id})
  .then(order=>{
    return res.status(200).json(order)
  }).catch(err=>console.log(err))
});



module.exports = router;