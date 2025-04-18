const express = require("express");
const { importUsers, exportAttendance, exportHomework, exportAttendancePDF } = require("../controllers/importExportController");
const upload = require("../middleware/fileUploadMiddleware");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Import Users via CSV/Excel
router.post("/import/users", authMiddleware(["SuperAdmin", "Admin"]), upload.single("file"), importUsers);

// Export Attendance Report (Excel & PDF)
router.get("/export/attendance", authMiddleware(["SuperAdmin", "Admin", "Teacher"]), exportAttendance);
router.get("/export/attendance/pdf", authMiddleware(["SuperAdmin", "Admin", "Teacher"]), exportAttendancePDF);

// Export Homework Report
router.get("/export/homework", authMiddleware(["SuperAdmin", "Admin", "Teacher"]), exportHomework);

module.exports = router;
