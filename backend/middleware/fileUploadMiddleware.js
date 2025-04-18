// const multer = require("multer");
// const path = require("path");

// // Configure storage for uploaded files
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/"); // Uploads will be stored in 'uploads' folder
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
//   }
// });

// // File filter to allow only CSV & Excel files
// const fileFilter = (req, file, cb) => {
//   if (file.mimetype === "text/csv" || file.mimetype.includes("spreadsheetml")) {
//     cb(null, true);
//   } else {
//     cb(new Error("Only CSV and Excel files are allowed"), false);
//   }
// };

// const upload = multer({ storage, fileFilter });

// module.exports = upload;

const multer = require("multer");
const path = require("path");

// Configure storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  }
});

// File filter to allow only CSV or Excel files
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "text/csv" || file.mimetype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
    cb(null, true);
  } else {
    cb(new Error("Only CSV or Excel files are allowed!"), false);
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
