const express = require("express");
const { assignStudentsToTeacher, getAssignedStudents } = require("../controllers/allocationController");
const { getTeacherStudents, addStudentNote } = require("../controllers/allocationController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Assign students to a teacher (Only SuperAdmin or Admin)
router.post("/assign", authMiddleware(["SuperAdmin", "Admin"]), assignStudentsToTeacher);

// Get students assigned to a teacher (Only Teacher)
router.get("/students", authMiddleware(["Teacher"]), getAssignedStudents);

// Get Students Assigned to a Teacher
router.get("/students", authMiddleware(["Teacher"]), getTeacherStudents);

// Add Note for a Student
router.post("/students/note", authMiddleware(["Teacher"]), addStudentNote);

module.exports = router;

