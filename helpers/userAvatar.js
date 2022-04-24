//---------------------------------------------|
//           All required modules              |
//---------------------------------------------|

const multer = require("multer");
const fs = require("fs");

//---------------------------------------------|
//           Image upload setup                |
//---------------------------------------------|
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let path;
    if (fs.existsSync("public/userAvatar/")) {
      path = "public/userAvatar/";
    } else {
      path = fs.mkdirSync("public/userAvatar/", { recursive: true });
    }
    cb(null, path);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.originalname + req.user.name + Date.now() + file.originalname
    );
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    const fileSize = parseInt(req.headers["content-length"]);
    let mime = file.mimetype;
    if (
      !(mime === "image/png" || mime === "image/jpeg" || mime === "image/jpg")
    ) {
      cb(new Error("You must choose jpg, png, jpeg"), false);
    } else if (fileSize > 1024 * 1024 * 2) {
      cb(new Error("Image size must not exceed 2mb"), false);
    } else {
      cb(null, true);
    }
  },
});

module.exports = upload;
