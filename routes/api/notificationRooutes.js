//---------------------------------------------|
//           All required modules              |
//---------------------------------------------|
const express = require("express");
const passport = require("passport");
const router = express.Router();
const notificationModel = require("../../models/notificationModel");
const userModel = require("../../models/userModel");

//---------------------------------------------|
//          GET ALL NOTIFICATION               |
//---------------------------------------------|
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    notificationModel
      .find({ to: { $regex: req.user.id } })
      .populate("from", "name avatar")
      .sort({ createdAt: -1 })
      .then((notifies) => {
        res.status(200).json(notifies);
      })
      .catch((err) => console.log(err));
  }
);

//---------------------------------------------|
//             POST NOTIFICATION               |
//---------------------------------------------|
router.post("/", async (req, res) => {
  const { type } = req.body;

  const to =
    type !== "userRegister"
      ? await userModel.find({
          $or: [{ role: "superAdmin" }, { _id: req.body.data.publisher._id }],
        })
      : await userModel.find({ role: "superAdmin" });

  const newNotificationModel = new notificationModel({
    from: req.body.from,
    data: req.body.data,
    type: type,
    to: to.map((user) => user.id),
  });

  newNotificationModel.save().then(() => {
    notificationModel
      .populate(newNotificationModel, { path: "from", select: "name avatar" })
      .then((d) => res.status(201).json(d));
  });
});

//---------------------------------------------|
//          DELETE NOTIFICATION                |
//---------------------------------------------|
router.post(
  "/delete",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    notificationModel
      .findOneAndUpdate(
        { _id: req.body.notificationID },
        { $pull: { to: req.user.id } },
        { new: true }
      )
      .then((noty) => {
        console.log(noty.to);
        if (noty.to.length < 1) {
          notificationModel
            .deleteOne({ _id: req.body.notificationID })
            .then((deleted) => res.status(200).json("delete"));
        } else {
          res.status(200).json("delete");
        }
      })
      .catch((err) => console.log(err));
  }
);

//---------------------------------------------|
//           CLEAR NOTIFICATION                |
//---------------------------------------------|
router.post(
  "/clear",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    notificationModel
      .find({ to: { $regex: req.user.id } })
      .then((done) => {
        const ids = done.map((d) => d._id);
        notificationModel
          .updateMany(
            { _id: { $in: ids } },
            { $pull: { to: req.user.id } },
            { new: true }
          )
          .then((done) => {
            notificationModel
              .deleteMany({ to: { $size: 0 } })
              .then((done) => res.status(200).json("clear"));
          });
      })
      .catch((err) => console.log(err));
  }
);

module.exports = router;
