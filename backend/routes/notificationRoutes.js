const express = require("express");
const { createNotification, getUserNotifications, markNotificationAsRead } = require("../controllers/notificationController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Create Notification
router.post("/", authMiddleware(["Admin", "Teacher", "SuperAdmin"]), createNotification);

// Get Notifications for a User
router.get("/", authMiddleware(["Student", "Admin", "Teacher", "SuperAdmin"]), getUserNotifications);

// Mark Notification as Read
router.put("/:id/read", authMiddleware(["Student", "Admin", "Teacher", "SuperAdmin"]), markNotificationAsRead);

module.exports = router;
