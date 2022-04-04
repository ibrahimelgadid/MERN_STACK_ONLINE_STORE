//---------------------------------------------|
//           All required modules              |
//---------------------------------------------|
const express = require('express');
const passport = require('passport');
const router = express.Router();
const Notification = require('../../models/Notification');
const User = require('../../models/User');



//---------------------------------------------|
//          GET ALL NOTIFICATION               |
//---------------------------------------------|
router.get('/',passport.authenticate('jwt', {session:false}),(req, res) => {
  Notification.find({to:{ "$regex": req.user.id}})
  .populate('from', 'name avatar')
  .sort({createdAt:-1})
  .then(notifies=>{
    res.status(200).json(notifies)
  }).catch((err)=>console.log(err))
});


//---------------------------------------------|
//             POST NOTIFICATION               |
//---------------------------------------------|
router.post('/',async(req, res) => {
  const {type} = req.body;
  
  const to = type!=='userRegister'?
    (await User.find({$or:[{role:'superAdmin'},{_id:req.body.data.publisher._id}]}))
    :await User.find({role:'superAdmin'});

  const newNotify = new Notification({
    from:req.body.from,
    data:req.body.data,
    type:type,
    to:to.map(user=>user.id)
  })

  newNotify.save()
  .then(()=>{
    Notification.populate(newNotify, {path:'from', select:'name avatar'})
    .then(d=>res.status(201).json(d))
  })
});



//---------------------------------------------|
//          DELETE NOTIFICATION                |
//---------------------------------------------|
router.post('/delete',passport.authenticate('jwt', {session:false}),(req, res) => {
  Notification.findOneAndUpdate(
    {_id:req.body.notify_id}, {$pull:{to:req.user.id}}, {new:true}
    )
  .then(noty=>{
    console.log(noty.to);
    if(noty.to.length<1){
      Notification.deleteOne({_id:req.body.notify_id})
      .then(deleted=>res.status(200).json('delete'))
    }else{

      res.status(200).json('delete')
    }
  })
  .catch(err=>console.log(err))
});




//---------------------------------------------|
//           CLEAR NOTIFICATION                |
//---------------------------------------------|
router.post('/clear',passport.authenticate('jwt', {session:false}),(req, res) => {
  Notification.find({to:{ "$regex": req.user.id}})
  .then(done=>{
    const ids = done.map(d=>d._id)
    Notification.updateMany({_id:{$in:ids}},{$pull:{to:req.user.id}},{new:true})
    .then(done=>{
      Notification.deleteMany({to:{$size:0}})
      .then(done=> res.status(200).json('clear'))
    })
  })
  .catch(err=>console.log(err))
});


module.exports = router;
