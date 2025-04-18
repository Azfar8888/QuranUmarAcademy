const express = require("express");
const { backupSystemData, generateAdminReports } = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Backup System Data (Only Admins)
router.get("/backup", authMiddleware(["Admin"]), backupSystemData);

// Generate Reports (Only Admins)
router.get("/reports", authMiddleware(["Admin"]), generateAdminReports);

module.exports = router;
