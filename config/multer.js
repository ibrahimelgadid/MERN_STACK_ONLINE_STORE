//---------------------------------------------|
//           All required modules
//---------------------------------------------|
const multer = require("multer");
const path = require("path");

//---------------------------------------------|
//           Image upload setup
//---------------------------------------------|

module.exports = multer({
  storage: multer.diskStorage({}),
  fileFilter: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const fileSize = parseInt(req.headers["content-length"]);
    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
      cb(new Error("File type is not supported"), false);
      return;
    } else if (fileSize > 1024 * 1024 * 2) {
      cb(new Error("Image size must not exceed 2mb"), false);
    } else {
      cb(null, true);
    }
  },
});
