//---------------------------------------------|
//  All required modules                       |          
//---------------------------------------------|
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const db = require('./config/databse').mongoURI;
const logger = require('morgan');
const passport = require('passport');
const cors = require('cors')




//---------------------------------------------|
//              All Routes modules             |          
//---------------------------------------------|
const usersRouter = require('./routes/api/users');
const productsRouter = require('./routes/api/products');
const categoriesRouter = require('./routes/api/categories');
const brandsRouter = require('./routes/api/brands');
const cartRouter = require('./routes/api/cart');
const ordersRouter = require('./routes/api/orders');
const postsRouter = require('./routes/api/posts');
const notificationsRouter = require('./routes/api/notifications');
const stripeRouter = require('./routes/api/stripe.js')



//---------------------------------------------|
//             connect to database             |
//---------------------------------------------|
mongoose.connect(db)
  .then(()=>console.log('Database is running....'))
  .catch((err)=>console.log(err));



//---------------------------------------------|
//             PASSPORT CONFIGURATION          |
//---------------------------------------------|
app.use(passport.initialize());
require('./config/passport')(passport)



//---------------------------------------------|
//             Display middlewares             |
//---------------------------------------------|
app.use(cors({origin:'http://localhost:3000'}))
app.use(logger('dev'));
app.use(require('express').urlencoded({ extended: false }));
app.use(require('express').json())
app.use(express.static('public'))



//---------------------------------------------|
//             Display All Routes              |
//---------------------------------------------|
app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/categories', categoriesRouter);
app.use('/brands', brandsRouter);
app.use('/cart', cartRouter);
app.use('/orders', ordersRouter);
app.use('/posts', postsRouter);
app.use('/notify', notificationsRouter);
app.use('/stripe', stripeRouter);


if (process.env.NODE_ENV === "production") {
  
  app.use(express.static('frontEnd/build'))
  app.get('*', (req,res)=>{
    res.sendFile(__dirname+"/frontEnd/build/index.html")
  })
}

//---------------------------------------------|
//              Display server                 |
//---------------------------------------------|
const port = process.env.PORT || 5000;
const server = app.listen(port, ()=>console.log('Server is running......'));



//---------------------------------------------|
//              Display socket                 |
//---------------------------------------------|
global.io = require('socket.io')(server, {
  cors:{
    origin:'http://localhost:3000',
  }
})


//---------------------------------------------|
//          Open Socket Connection             |
//---------------------------------------------|
io.on('connection', (socket) => {
  console.log('Connection success');

  // send notifications
  require('./config/socketConnections').addNewProduct(socket)

  // on disconnection
  socket.on('disconnect', () => {
    console.log('Connection disconnected', socket.id);
  })
})