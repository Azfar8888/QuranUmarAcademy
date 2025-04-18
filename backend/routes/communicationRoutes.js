const express = require("express");
const { sendMessage, getInbox, markAsRead } = require("../controllers/communicationController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Send Message (Teachers and Admins)
router.post("/send", authMiddleware(["Teacher", "Admin", "SuperAdmin"]), sendMessage);

// Get Inbox for User
router.get("/inbox", authMiddleware(["Teacher", "Admin", "SuperAdmin", "Student"]), getInbox);

// Mark Message as Read
router.put("/:messageId/read", authMiddleware(["Teacher", "Admin", "SuperAdmin", "Student"]), markAsRead);

module.exports = router;
