//---------------------------------------------|
//           All required modules              |
//---------------------------------------------|
const express = require('express');
const router = express.Router();
const passport = require('passport');
const Brand = require('../../models/Brand');
const brandErrors = require('../../validation/brand');



//---------------------------------------------|
//             GET ALL BRANDS                  |
//---------------------------------------------|
// public route
// access --> /brands
//----------------------|
router.get('/',(req, res) =>{
  Brand.find()
  .populate('publisher', ['name'])
  .then(brands=>{
    return res.status(200).json(brands)
  })
  .catch(err=>console.log(err))
});


//---------------------------------------------|
//             GET brand BY ID              |
//---------------------------------------------|
router.get('/:bran_id', passport.authenticate('jwt', {session:false}),(req, res) =>{
  if(req.user.role !=="user"){
    Brand.findOne({_id:req.params.bran_id})
    .populate('publisher', ['name'])
    .then(brand=>{
      return res.status(200).json(brand)
    })
    .catch(err=>console.log(err))
  }
});




//---------------------------------------------|
//             ADD NEW BRAND                   |
//---------------------------------------------|
router.post('/', passport.authenticate('jwt', {session:false}), 
  (req, res) => {
    //check for admin role
    if (req.user.role !=='user') {
      let {isValid,errors} = brandErrors(req.body);
      if (!isValid) {
        return res.status(400).json(errors)
      }  
      
      Brand.findOne({name:req.body.name})
      .then(brand=>{
        if(brand){
          let errors = {};
          errors.uniqueName = 'Name must be unique';
          return res.status(400).json(errors)
        }  
        
        let brandData =new Brand ({
          name:req.body.name,
          description:req.body.description,
          publisher:req.user.id,
        })  
        
        brandData.save()
        .then(brand=>{
          Brand.populate(brandData, {path:"publisher", select:'name'}, (err, brand)=>{
            if (err) {console.log(err);}
            res.status(201).json(brand)
          })  
        })  
        .catch(err=>console.log(err))

      })  
      
    }else{
      let errors = {};
      errors.userNotAdmin = "You are not have admin privilleges";
      return res.status(400).json(errors)
    }  
  });  



//---------------------------------------------|  
//             EDIT BRAND BY ID              |
//---------------------------------------------|
//
// for only authenticated admins
//
router.put('/:bran_id', passport.authenticate('jwt', {session:false}),
(req, res) => {
  if (req.user.role !=='user') {

    //check for validations
    let {isValid,errors} = brandErrors(req.body);
    if (!isValid) {return res.status(400).json(errors)}
    
    
    Brand.findOne({name:req.body.name})
    .then(cat=>{
      if(cat){
        if(cat._id.toString() !== req.params.bran_id){
          let errors = {};
          errors.uniqueName = 'Name must be unique';
          return res.status(400).json(errors)
        }  
      }  
      
      
      const brandData = {
        name:req.body.name,
        description:req.body.description,
        brand:req.body.brand,
      }  
      

      
      Brand.findOneAndUpdate({_id:req.params.bran_id},{$set:brandData}, {new:true})
      .populate('publisher',['name'])
      .then(categ=>res.status(200).json(categ))
      .catch(err=>console.log(err))
      
    }).catch(err=>console.log(err))  
    
  }else{
    let errors = {};
    errors.userNotAdmin = "You are not have admin privilleges";
    return res.status(400).json(errors)
  }  
});  




//---------------------------------------------|
//             DELETE brand BY ID           |
//---------------------------------------------|
router.delete('/:bran_id', passport.authenticate('jwt', {session:false}),(req, res) => {
  if (req.user.role !=='user') {
    Brand.findOneAndDelete({_id:req.params.bran_id},{new:true})
      .then(cat=>{
        if (cat) {
          return res.status(200).json('done');
        }
        let errors = {};
        errors.brand = "There is no brand for this id"
        return res.status(400).json(errors);
      })
      .catch(err=>console.log(err))
  }else{
    let errors = {};
    errors.userNotAdmin = "You are not have admin privilleges";
    return res.status(400).json(errors)
  }
});


module.exports = router;
