//---------------------------------------------|
//  All required modules                       |
//---------------------------------------------|
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const logger = require("morgan");
const passport = require("passport");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

//---------------------------------------------|
//              All Routes modules             |
//---------------------------------------------|
const usersRouter = require("./routes/api/userRoutes");
const productsRouter = require("./routes/api/productRoutes");
const categoriesRouter = require("./routes/api/categoryRoutes");
const brandsRouter = require("./routes/api/brandRoutes");
const cartRouter = require("./routes/api/cartRoutes");
const ordersRouter = require("./routes/api/orderRoutes");
const postsRouter = require("./routes/api/postRoutes");
const notificationsRouter = require("./routes/api/notificationRoutes");
const stripeRouter = require("./routes/api/stripeRoutes");

//---------------------------------------------|
//             connect to database             |
//---------------------------------------------|
mongoose
  .connect(process.env.mongoURI)
  .then(() => console.log("Database is running...."))
  .catch((err) => console.log(err));

//---------------------------------------------|
//             PASSPORT CONFIGURATION          |
//---------------------------------------------|
app.use(passport.initialize());
require("./config/passport")(passport);

//---------------------------------------------|
//             Display middlewares             |
//---------------------------------------------|
app.use(cors());
app.use(logger("dev"));
app.use(require("express").urlencoded({ extended: false }));
app.use(require("express").json());
app.use(express.static("public"));

//---------------------------------------------|
//             Display All Routes              |
//---------------------------------------------|
app.use("/users", usersRouter);
app.use("/products", productsRouter);
app.use("/categories", categoriesRouter);
app.use("/brands", brandsRouter);
app.use("/cart", cartRouter);
app.use("/orders", ordersRouter);
app.use("/posts", postsRouter);
app.use("/notify", notificationsRouter);
app.use("/stripe", stripeRouter);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("frontEnd/build"));
  app.get("*", (req, res) => {
    res.sendFile(__dirname + "/frontEnd/build/index.html");
  });
}

//---------------------------------------------|
//              Display server                 |
//---------------------------------------------|
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => console.log("Server is running......"));

//---------------------------------------------|
//              Display socket                 |
//---------------------------------------------|
global.io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

//---------------------------------------------|
//          Open Socket Connection             |
//---------------------------------------------|
io.on("connection", (socket) => {
  console.log("Connection success");

  // send notifications
  require("./config/socketConnections").addNewProduct(socket);

  // on disconnection
  socket.on("disconnect", () => {
    console.log("Connection disconnected", socket.id);
  });
});
/////////////////////////////////////////

function strCount(str, letter) {
  return str.split(letter).length - 1;
}
console.log(strCount("Hello", "l"));
