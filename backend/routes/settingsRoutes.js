const express = require("express");
const { getSettings, updateSettings } = require("../controllers/settingsController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Get System Settings (Only SuperAdmin)
router.get("/", authMiddleware(["SuperAdmin"]), getSettings);

// Update System Settings (Only SuperAdmin)
router.put("/", authMiddleware(["SuperAdmin"]), updateSettings);

module.exports = router;
