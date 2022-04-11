//---------------------------------------------|
//           All required modules              |
//---------------------------------------------|
const express = require('express');
const router = express.Router();
const passport = require('passport');
const Product = require('../../models/Product');
const productErrors = require('../../validation/product');
const multer = require('multer');
const fs = require('fs');
const isEmpty = require('../../validation/isEmpty');



//---------------------------------------------|
//           Image gallery setup               |
//---------------------------------------------|
const gallaryStorage = multer.diskStorage({
  destination:function (req,file, cb) {
  let path ;
  if ( fs.existsSync('public/gallary/'+req.params.pro_id)) {
    console.log('exist')
      path = 'public/gallary/'+req.params.pro_id;
  } 
  else {
      path = fs.mkdirSync('public/gallary/'+req.params.pro_id,{ recursive: true });
  }
      cb(null, path)
  },
      filename :function (req,file, cb) {
  cb(null,file.originalname+req.user.name+Date.now()+file.originalname)
  }
})

const uploadGalleryImages = multer({
  storage:gallaryStorage,
  limits:{
    fileSize:1024*1024*3  ,
  },
  fileFilter:function (req, file, cb) {
    if (file.mimetype === 'image/png'||file.mimetype === 'image/jpeg' ||file.mimetype === 'image/jpg') {
      cb(null,true)
    }else{
      cb( new Error('You must choose jpg, png'), false)
    }
  }
});


//---------------------------------------------|
//           Image upload setup                |
//---------------------------------------------|
const storage = multer.diskStorage({
  destination:function (req,file, cb) {
  let path ;
  if ( fs.existsSync('public/proImage/')) {
      path = 'public/proImage/';
  } 
  else {
      path = fs.mkdirSync('public/proImage/',{ recursive: true });
  }
      cb(null, path)
  },
      filename :function (req,file, cb) {
  cb(null,file.originalname+req.user.name+Date.now()+file.originalname)
  }
})

const uploadProImage = multer({
  storage:storage,
  fileFilter:function (req, file, cb) {
      const fileSize = parseInt(req.headers['content-length']);
      let {isValid, errors} = productErrors(req.body)
      let mime = file.mimetype;
      if (!(mime==='image/png'||mime==='image/jpeg'||mime==='image/jpg')) {
        cb( new Error('You must choose jpg, png, jpeg'), false)
      }else if (req.user.role==='user') {
        cb( new Error( 'You are not have admin privilleges'), false)
        
      }else if (fileSize > 1024*1024*2) {
          cb( new Error('Image size must not exceed 2mb'), false)
      }else if (!isValid) {
        cb(new Error( Object.values(errors).map(error=>error)), false)
        
      }else{
          cb(null,true)
      }
  }
});





//---------------------------------------------|
//             GET ALL PRODUCTS                |
//---------------------------------------------|
router.get('/',(req, res) => {
  const {page} = req.query
  const limit = 4;
  const skip =page * limit;
  Product
    .find()
    .populate('publisher', ['name'])
    .limit(limit)
    .skip(parseInt(skip))
    .then(products=>{
      Product.count()
      .then(count=>{
        res.status(200).json({count:Math.ceil(count/limit),products})
      })
    })
    .catch(err=>console.log(err))
});


//---------------------------------------------|
//      GET ALL PRODUCTS FOR ADMINS            |
//---------------------------------------------|
router.get('/admins',(req, res) => {
  // let {page} = req.query
  // let limit = 4;
  // let skip =page * limit;
  Product
    .find()
    .sort({createdAt:-1})
    .populate('publisher', ['name'])
    // .limit(limit)
    // .skip(parseInt(skip))
    .then(products=>{
      Product.count()
      .then(count=>{
        res.status(200).json({count,products})
      })
    })
    .catch(err=>console.log(err))
});


//---------------------------------------------|
//             GET PRODUCT BY ID               |
//---------------------------------------------|
router.get('/:pro_id',(req, res) => {
  Product.findOne({_id:req.params.pro_id})
    .populate('publisher', ['name'])
    .then(pro=>res.status(200).json(pro))
    .catch(err=>res.sendStatus(404))
});



//---------------------------------------------|
//      GET PRODUCTS BY CATEGORTY NAME         |
//---------------------------------------------|
router.get('/category/:category',(req, res) => {
  let {page} = req.query
  let limit = 4;
  let skip = page * limit;
  Product.find({category:req.params.category})
    .populate('publisher', ['name'])
    .limit(limit)
    .skip(parseInt(skip))
    .then(products=>{
      Product.count()
      .then(count=>{
        res.status(200).json({count:Math.ceil(count/limit),products})
      })
    })
    .catch(err=>console.log(err))
});



//---------------------------------------------|
//      GET PRODUCTS BY BRAND NAME             |
//---------------------------------------------|
router.get('/brand/:brand',(req, res) => {
  let {page} = req.query
  let limit = 2
  let skip =page * limit;
  Product.find({brand:req.params.brand})
    .populate('publisher', ['name'])
    .limit(limit)
    .skip(parseInt(skip))
    .then(products=>{
      Product.count()
      .then(count=>{
        res.status(200).json({count:Math.ceil(count/limit),products})
      })
    })
    .catch(err=>console.log(err))
});




//---------------------------------------------|
//     GET PRODUCTS BY SPECIFIC FILTER         |
//---------------------------------------------|
router.post('/filter', function(req, res, next) {
  const {page} = req.query
  const limit = 4;
  const skip =page * limit;
  const reqs = {};
  !isEmpty(req.body.category) ?reqs.category=req.body.category:'';
  !isEmpty(req.body.brand) ?reqs.brand=req.body.brand:'';
  reqs.price={$lte:req.body.price[1], $gte:req.body.price[0]};

  Product.find(reqs).populate('publisher', ['name']).limit(limit)
  .skip(skip)
  .then(products=>{
    Product.count()
    .then(count=>{
      res.status(200).json({count:Math.ceil(count/limit),products})
    })
  }).catch(err=>console.log(err))
})
//////////////////////////////



//---------------------------------------------|
//     GET PRODUCTS BY SEARCH WORD             |
//---------------------------------------------|
  router.post('/search', function(req, res, next) {
    let {page} = req.query
    let limit = 4;
    let skip = page * limit;
    let search =(req.body.search);
    Product.find({name:{$regex:'.*'+search+'.*',$options:"i"}})
    .populate('publisher', ['name'])
    .limit(limit)
    .skip(parseInt(skip))
    .then(products=>{
      Product.count()
      .then(count=>{
        res.status(200).json({count:Math.ceil(count/limit),products})
      })
    })
    .catch(err=>console.log(err))
 })
 //////////////////////////////






//---------------------------------------------|
//             EDIT PRODUCT BY ID              |
//---------------------------------------------|
//
// for only authenticated admins
//
router.put('/:pro_id', passport.authenticate('jwt', {session:false}),
uploadProImage.single('productImage'), (err,req, res,next)=>{
  if (err) {
    let errors = {};
    errors.ProductAvatar = err.message.split(',');
    return res.status(400).json(errors.ProductAvatar.map(err=>err))
  }
},
(req, res) => {
  if (req.user.role !=='user') {

    //check for validations
    let {isValid,errors} = productErrors(req.body);
    if (!isValid) {return res.status(400).json(errors)}
    
    
    Product.findOne({name:req.body.name})
    .then(pro=>{
      if(pro){
        if(pro._id.toString() !== req.params.pro_id){
          let errors = {};
          errors.uniqueName = 'Name must be unique';
          return res.status(400).json(errors)
        }
      }

      const productsData = {
        name:(`${req.body.name[0].toUpperCase()}${req.body.name.slice(1)}`),
        price:req.body.price,
        category:req.body.category,
        brand:req.body.brand
      }
      
      if(req.file){
        if(pro.productImage !== 'noimage.png'){
          fs.unlink("public/proImage/"+pro.productImage, (err)=>{
            if (err) {
              console.log(err)
            } 
          })
        }
        productsData.productImage = req.file.filename;
      }
      
      Product.findOneAndUpdate({_id:req.params.pro_id},{$set:productsData}, {new:true})
      .then(prod=>res.status(200).json(prod))
      .catch(err=>console.log(err))
      
    }).catch(err=>console.log(err))
    
  }else{
    let errors = {};
    errors.userNotAdmin = "You are not have admin privilleges";
    return res.status(400).json(errors)
  }
});



//---------------------------------------------|
//             ADD NEW PRODUCT                 |
//---------------------------------------------|
router.post('/', passport.authenticate('jwt', {session:false}),

uploadProImage.single('productImage'), (err,req, res,next)=>{
  if (err) {
    let errors = {};
    errors.ProductAvatar = err.message.split(',');
    return res.status(400).json(errors.ProductAvatar.map(err=>err))
  }
},

(req, res) => {
  if (req.user.role !=='user') {
    let {isValid,errors} = productErrors(req.body);
    if (!isValid) {
      return res.status(400).json(errors)
    }
    
    Product.findOne({name:req.body.name})
    .then(pro=>{
      if(pro){
        let errors = {};
        errors.uniqueName = 'Name must be unique';
        return res.status(400).json(errors)
      }
      
      let productData =new Product ({
        name:(`${req.body.name[0].toUpperCase()}${req.body.name.slice(1)}`),
        price:req.body.price,
        category:req.body.category,
        brand:req.body.brand,
        publisher:req.user.id,
      })
      
      if (req.file) {
        productData.productImage = req.file.filename;
      }
      
      productData.save()
      .then(pro=>res.status(201).json('done'))
      .catch(err=>console.log(err))
    })
    
  }else{
    let errors = {};
    errors.userNotAdmin = "You are not have admin privilleges";
    return res.status(400).json(errors)
  }
});


//---------------------------------------------|
//             DELETE PRODUCT BY ID            |
//---------------------------------------------|
router.delete('/:pro_id', passport.authenticate('jwt', {session:false}),(req, res) => {
  if (req.user.role !=='user') {

    Product.findOneAndDelete({_id:req.params.pro_id},{new:true})
      .then(pro=>{
        if (pro) {

          //delete image if not equal noimage.png
          if (pro.productImage != "noimage.png") {
              fs.unlink("public/proImage/"+pro.productImage, (err)=>{
            if (err) {
            console.log(err)
            } 
          })
          }

          //delete product gallary if exists
          if(fs.existsSync(`public/gallary/${req.params.pro_id}`)){
            fs.rm(`public/gallary/${req.params.pro_id}`, {recursive:true},(err)=>{
              if (err) {
              console.log(err)
              } 
            })
          }

          return res.status(200).json('done');
        }
        let errors = {};
        errors.product = "There is no product for this id"
        return res.status(400).json(errors);
      })
      .catch(err=>console.log(err))

  }else{
    let errors = {};
    errors.userNotAdmin = "You are not have admin privilleges";
    return res.status(400).json(errors)
  }
});



//---------------------------------------------|
//     SORT PRODUCTS BY PRODUCT NAME ASC       |
//---------------------------------------------|
router.get('/sort/:sorted/:num',(req, res) => {
  let {page} = req.query
  let limit = 4;
  let skip =page * limit;

  Product.find()
  .sort({[req.params.sorted]:req.params.num==='true'?1:-1}) 
    .populate('publisher', ['name'])
    .limit(limit)
    .skip(skip)
    .then(products=>{
      Product.count()
      .then(count=>{
        res.status(200).json({count:Math.ceil(count/limit),products})
      })
    })
    .catch(err=>console.log(err))

});



//---------------------------------------------|
//            Upload gallary images            |
//---------------------------------------------|
router.post('/gallary/:pro_id',passport.authenticate('jwt',
 {session:false}),uploadGalleryImages.array('gallary'),
(err,req,res,next)=>{
  if(err) return console.log(err.message);
}
,(req,res)=>{
    Product.findOneAndUpdate({_id:req.params.pro_id},{$push:{productGallary:{$each:req.files.map(file=>file.filename)}}},{new:true},(err,done)=>{
      if(err) return console.log(err);
      res.status(200).json(done);
    })
});


//---------------------------------------------|
//            DELETE GALLARY IMAGES            |
//---------------------------------------------|
router.delete('/gallary/:pro_id/:img',passport.authenticate('jwt',
 {session:false}),(req,res)=>{
  Product.findByIdAndUpdate({_id:req.params.pro_id},{$pull:{productGallary:req.params.img}},{new:true}, (err,product)=>{
    if (err) { console.log(err);}
    fs.unlink(`public/gallary/${req.params.pro_id}/${req.params.img}`, (err)=>{
      if (err) {
      console.log(err)
      } 
    })
    return res.status(200).json(product)
  })
});


module.exports = router;