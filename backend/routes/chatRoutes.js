// const express = require("express");
// const router = express.Router();
// const { createGroup, getGroups, sendMessage, getMessages } = require("../controllers/chatController");
// const authMiddleware = require("../middleware/authMiddleware");

// router.post("/groups", authMiddleware, createGroup);
// router.get("/groups", authMiddleware, getGroups);
// router.post("/sendMessage", authMiddleware, sendMessage);
// router.get("/messages/:groupId", authMiddleware, getMessages);

// module.exports = router;

const express = require("express");
const { createGroup, getGroups, sendMessage, getMessages } = require("../controllers/chatController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/groups", authMiddleware, createGroup);
router.get("/groups", authMiddleware, getGroups);
router.post("/sendMessage", authMiddleware, sendMessage);
router.get("/messages/:groupId", authMiddleware, getMessages);

module.exports = router;





// const express = require("express");
// const router = express.Router();
// const chatController = require("../controllers/chatController");
// const { createGroup, getAllGroups, sendMessage, serveFile } = require("../controllers/chatController");
// const authMiddleware = require("../middleware/authMiddleware");
// const multer = require("multer");

// // Multer for File Uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/");
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   },
// });
// // const upload = multer({ storage });
// const upload = multer({ dest: "uploads/" });

// // router.post("/groups", authMiddleware(["SuperAdmin"]), createGroup);
// // router.get("/groups", authMiddleware, async (req, res) => {
// //   try {
// //     const groups = await Group.find().populate("members", "name email role");
// //     res.status(200).json(groups);
// //   } catch (error) {
// //     res.status(500).json({ message: "Error fetching groups", error: error.message });
// //   }
// // });

// // ✅ Group Routes
// router.post("/groups", authMiddleware(["SuperAdmin"]), createGroup);
// router.get("/groups", authMiddleware(["SuperAdmin", "Admin", "Teacher", "Student"]), getAllGroups);

// // ✅ Message Routes
// //router.post("/sendMessage", authMiddleware(["SuperAdmin", "Admin", "Teacher", "Student"]), chatController.sendMessage);
// router.get("/messages/:groupId", authMiddleware(["SuperAdmin", "Admin", "Teacher", "Student"]), chatController.getMessages);
// // Send a message (Text, Image, Audio, Emoji)
// // router.post("/sendMessage", authMiddleware, upload.single("file"), sendMessage);

// // Serve uploaded files
// router.get("/uploads/:filename", serveFile);
// // ✅ File Upload Route
// router.post("/upload", upload.single("file"), chatController.uploadFile);
// router.post("/sendMessage", upload.single("file"), authMiddleware, sendMessage);


// //router.post("/sendMessage", authMiddleware, sendMessage);

// module.exports = router;

// const express = require("express");
// const { createGroup, getGroups, sendMessage, getMessages, uploadFile } = require("../controllers/chatController");
// const authMiddleware = require("../middleware/authMiddleware");
// const multer = require("multer");
// const path = require("path");

// const router = express.Router();

// // Configure storage for uploaded files
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/");
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   },
// });

// const upload = multer({ storage });

// // Routes
// router.post("/groups", authMiddleware, createGroup); // ✅ Create Group
// router.get("/groups", authMiddleware, getGroups); // ✅ Fetch Groups


// router.post("/sendMessage", authMiddleware, sendMessage); // ✅ Send Message
// router.get("/messages/:groupId", authMiddleware, getMessages); // ✅ Fetch Messages

// router.post("/upload", authMiddleware, upload.single("file"), uploadFile); // ✅ Upload Files (Image/Audio)

// module.exports = router;
