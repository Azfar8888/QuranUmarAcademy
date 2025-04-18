const express = require("express");
const { getSuperAdminDashboard, getTeacherDashboard, getStudentDashboard } = require("../controllers/dashboardController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Super Admin Dashboard
router.get("/superadmin", authMiddleware(["SuperAdmin"]), getSuperAdminDashboard);

// Teacher Dashboard
router.get("/teacher", authMiddleware(["Teacher"]), getTeacherDashboard);

// Student Dashboard
router.get("/student", authMiddleware(["Student"]), getStudentDashboard);

module.exports = router;
