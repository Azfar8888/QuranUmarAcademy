const express = require("express");
const { generatePerformanceReport, generateAttendanceReport, generateHomeworkReport } = require("../controllers/reportController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Generate Performance Report
router.get("/performance", authMiddleware(["SuperAdmin", "Admin", "Teacher", "Student"]), generatePerformanceReport);

// Generate Attendance Report
router.get("/attendance", authMiddleware(["SuperAdmin", "Admin", "Teacher"]), generateAttendanceReport);

// Generate Homework Report
router.get("/homework", authMiddleware(["SuperAdmin", "Admin", "Teacher"]), generateHomeworkReport);


module.exports = router;
