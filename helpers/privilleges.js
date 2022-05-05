//---------------------------------------------|
//           All required modules
//---------------------------------------------|
const isAdmin = (req, res, next) => {
  if (req.user.role === "admin") {
    next();
  } else {
    return;
  }
};
const isSuperAdmin = (req, res, next) => {
  if (req.user.role === "superAdmin") {
    next();
  } else {
    return;
  }
};

const isAdminAndSuperAdmin = (req, res, next) => {
  if (req.user.role === "admin" || req.user.role === "superAdmin") {
    next();
  } else {
    return;
  }
};

const isUser = (req, res, next) => {
  if (req.user.role === "user") {
    next();
  } else {
    return;
  }
};

const notUser = (req, res, next) => {
  if (req.user.role !== "user") {
    next();
  } else {
    return;
  }
};

const notOwner = (req, res, modelUser, modelName) => {
  if (modelUser.toString() !== req.user.id) {
    return res
      .status(400)
      .json({ notOwner: `You are not owner of this ${modelName}` });
  }
};

module.exports = {
  isAdmin,
  isAdminAndSuperAdmin,
  notOwner,
  isSuperAdmin,
  isUser,
  notUser,
};
