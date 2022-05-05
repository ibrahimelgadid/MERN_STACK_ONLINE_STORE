//---------------------------------------------|
//           All required modules
//---------------------------------------------|
const notificationModel = require("../models/notificationModel");
const userModel = require("../models/userModel");
const asyncHandler = require("express-async-handler");

//---------------------------------------------|
//           GET NOTIFICATIONS
//---------------------------------------------|
const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await notificationModel
    .find({ to: { $regex: req.user.id } })
    .populate("from", "name avatar")
    .sort({ createdAt: -1 });
  res.status(200).json(notifications);
});

//---------------------------------------------|
//             POST NOTIFICATION
//---------------------------------------------|

const addNewNotification = asyncHandler(async (req, res) => {
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

  let newNotification = await newNotificationModel.save();
  if (newNotification) {
    newNotification = await notificationModel.populate(newNotificationModel, {
      path: "from",
      select: "name avatar",
    });
    res.status(201).json(newNotification);
  }
});

//---------------------------------------------|
//          DELETE NOTIFICATION
//---------------------------------------------|
const deleteNotification = asyncHandler(async (req, res) => {
  const updatedNotification = await notificationModel.findOneAndUpdate(
    { _id: req.body.notificationID },
    { $pull: { to: req.user.id } },
    { new: true }
  );
  if (updatedNotification.to.length < 1) {
    await notificationModel.deleteOne({ _id: req.body.notificationID });
    res.status(200).json("delete");
  } else {
    res.status(200).json("delete");
  }
});

//---------------------------------------------|
//          CLEAR NOTIFICATIONS
//---------------------------------------------|
const clearNotifications = asyncHandler(async (req, res) => {
  const allMyNotifications = await notificationModel.find({
    to: { $regex: req.user.id },
  });
  const ids = allMyNotifications.map((n) => n._id);
  await notificationModel.updateMany(
    { _id: { $in: ids } },
    { $pull: { to: req.user.id } },
    { new: true }
  );
  await notificationModel.deleteMany({ to: { $size: 0 } });
  res.status(200).json("clear");
});
// export modules
module.exports = {
  getNotifications,
  addNewNotification,
  clearNotifications,
  deleteNotification,
};
