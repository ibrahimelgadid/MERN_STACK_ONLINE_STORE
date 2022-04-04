//---------------------------------------------|
//           All required modules              |
//---------------------------------------------|
const express = require('express');
const router = express.Router();
const passport = require('passport');
const Category = require('../../models/Category');
const validateCategoryInput = require('../../validation/category');


//---------------------------------------------|
//             POST TEST CATEGORIES            |
//---------------------------------------------|
router.get('/test', (req, res) => res.json({ msg: 'Categories Works' }));



//---------------------------------------------|
//             ADD NEW CATEGORY                |
//---------------------------------------------|
router.post('/', passport.authenticate('jwt', {session:false}), 
  (req, res) => {
    //check for admin role
    if (req.user.role !=='user') {
      let {isValid,errors} = validateCategoryInput(req.body);
      if (!isValid) {
        return res.status(400).json(errors)
      }
      
      Category.findOne({name:req.body.name})
      .then(category=>{
        if(category){
          let errors = {};
          errors.uniqueName = 'Name must be unique';
          return res.status(400).json(errors)
        }
        
        let categoryData =new Category ({
          name:req.body.name,
          description:req.body.description,
          publisher:req.user.id,
        })
        
        categoryData.save()
        .then(category=>{
          Category.populate(categoryData, {path:"publisher", select:'name'}, (err, category)=>{
            if (err) {console.log(err);}
            res.status(201).json(category)
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
//             EDIT CATEGORY BY ID              |
//---------------------------------------------|
//
// for only authenticated admins
//
router.put('/:cat_id', passport.authenticate('jwt', {session:false}),
(req, res) => {
  if (req.user.role !=='user') {

    //check for validations
    let {isValid,errors} = validateCategoryInput(req.body);
    if (!isValid) {return res.status(400).json(errors)}
    
    
    Category.findOne({name:req.body.name})
    .then(cat=>{
      if(cat){
        if(cat._id.toString() !== req.params.cat_id){
          let errors = {};
          errors.uniqueName = 'Name must be unique';
          return res.status(400).json(errors)
        }
      }
      
      
      const categoryData = {
        name:req.body.name,
        description:req.body.description,
        category:req.body.category,
      }
      

      
      Category.findOneAndUpdate({_id:req.params.cat_id},{$set:categoryData}, {new:true})
      .populate('publisher', ['name'])
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
//             GET ALL CATEGORIES              |
//---------------------------------------------|
router.get('/',(req, res) =>{
  Category.find()
  .populate('publisher', ['name'])
  .then(categories=>{
    return res.status(200).json(categories)
  })
  .catch(err=>console.log(err))
});


//---------------------------------------------|
//             GET CATEGORY BY ID              |
//---------------------------------------------|
router.get('/:cat_id', passport.authenticate('jwt', {session:false}),(req, res) =>{
  if(req.user.role !=="user"){
    Category.findOne({_id:req.params.cat_id})
    .populate('publisher', ['name'])
    .then(category=>{
      return res.status(200).json(category)
    }).catch(err=>console.log(err))
  }
});


//---------------------------------------------|
//             DELETE CATEGORY BY ID           |
//---------------------------------------------|
router.delete('/:cat_id', passport.authenticate('jwt', {session:false}),(req, res) => {
  if (req.user.role !=='user') {
    Category.findOneAndDelete({_id:req.params.cat_id},{new:true})
      .then(cat=>{
        if (cat) {
          return res.status(200).json('done');
        }
        let errors = {};
        errors.category = "There is no category for this id"
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
