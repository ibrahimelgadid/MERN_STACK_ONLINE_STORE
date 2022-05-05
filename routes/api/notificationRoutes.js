//---------------------------------------------|
//           All required modules              |
//---------------------------------------------|
const router = require("express").Router();
const passport = require("passport");
const {
  getNotifications,
  addNewNotification,
  clearNotifications,
  deleteNotification,
} = require("../../controllers/notificationControllers");

//---------------------------------------------|
//          GET ALL NOTIFICATION
//---------------------------------------------|
router
  .route("/")
  .get(passport.authenticate("jwt", { session: false }), getNotifications);

//---------------------------------------------|
//             POST NOTIFICATION
//---------------------------------------------|
router.route("/").post(addNewNotification);

//---------------------------------------------|
//          DELETE NOTIFICATION
//---------------------------------------------|
router
  .route("/delete")
  .post(passport.authenticate("jwt", { session: false }), deleteNotification);

//---------------------------------------------|
//           CLEAR NOTIFICATION
//---------------------------------------------|
router
  .route("/clear")
  .post(passport.authenticate("jwt", { session: false }), clearNotifications);

module.exports = router;
