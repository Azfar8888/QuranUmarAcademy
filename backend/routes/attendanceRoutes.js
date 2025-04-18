const express = require("express");
const { 
    markAttendance, 
    getAttendance, 
    markAttendanceForStudents,
    viewAttendanceHistory,
    bulkAttendanceUpload, 
    generateAttendanceReport,
    getStudentAttendance, 
    notifyAbsence,
    editAttendance,
    updateAttendance,
    getStudentsAttendance,
    markTeacherAttendance

} = require("../controllers/attendanceController");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/fileUploadMiddleware");

const router = express.Router();

// Mark Attendance (Only Teacher)
//router.post("/mark", authMiddleware(["Teacher"]), markAttendance);
router.post("/mark", authMiddleware(["SuperAdmin", "Teacher"]), markAttendance);
router.post("/mark-student", authMiddleware(["SuperAdmin", "Teacher"]),markAttendanceForStudents);
//router.post('/mark', markTeacherAttendance);

// router.post("/mark", authMiddleware, markAttendance);
// router.put("/edit/:id", authMiddleware, editAttendance);
// router.put("/update/:id", authMiddleware, updateAttendance);
router.put("/update/:id", authMiddleware(["SuperAdmin", "Admin", "Teacher"]), updateAttendance);

router.get("/attendance/students/history", authMiddleware(["Teacher"]), getStudentsAttendance);
//router.get("/attendance/students/history", authMiddleware(["Teacher"]), getStudentsAttendance);
router.get("/students/history", authMiddleware(["Teacher"]), getStudentsAttendance);
router.get("/teacher/history", authMiddleware(["Teacher"]), viewAttendanceHistory);




// Get Attendance (Filter by Teacher & Date)
router.get("/", authMiddleware(["SuperAdmin", "Admin", "Teacher"]), getAttendance);

// Bulk Attendance Upload (Only Teacher)
router.post("/bulk-upload", authMiddleware(["Teacher"]), upload.single("file"), bulkAttendanceUpload);

// Generate Attendance Report
router.get("/report", authMiddleware(["SuperAdmin", "Admin"]), generateAttendanceReport);


// Mark Attendance for Allocated Students (Only Teacher)
router.post("/teacher/mark", authMiddleware(["Teacher"]), markAttendanceForStudents);

// View Attendance History (Only Teacher)
router.get("/teacher/history", authMiddleware(["Teacher"]), viewAttendanceHistory);

// Get Attendance for a Student (Only Student)
router.get("/student", authMiddleware(["Student"]), getStudentAttendance);

// Notify Teacher of an Absence (Only Student)
router.post("/student/notify", authMiddleware(["Student"]), notifyAbsence);

module.exports = router;

// const express = require("express");
// const {
//   markAttendance,
//   getAttendance,
//   markAttendanceForStudents,
//   getTeacherAttendance,
//   getStudentAttendanceForTeacher,
//   viewAttendanceHistory,
//   bulkAttendanceUpload,
//   generateAttendanceReport,
//   getStudentAttendance,
//   notifyAbsence,
//   editAttendance,
//   updateAttendance,
//   getStudentsAttendance,
//   getTeachersAttendance
// } = require("../controllers/attendanceController");

// const authMiddleware = require("../middleware/authMiddleware");
// const upload = require("../middleware/fileUploadMiddleware");

// const router = express.Router();

// // ✅ Mark Attendance (Only Teacher can mark student attendance)
// router.post("/mark-student", authMiddleware(["Teacher"]), markAttendanceForStudents);

// // ✅ Mark Attendance for Teacher (SuperAdmin Only)
// router.post("/mark-teacher", authMiddleware(["SuperAdmin"]), markAttendance);

// // ✅ Update Attendance
// router.put("/update/:id", authMiddleware(["SuperAdmin", "Admin", "Teacher"]), updateAttendance);

// // ✅ Fetch Teacher's Own Attendance
// router.get("/teacher/history", authMiddleware(["Teacher"]), getTeacherAttendance);

// // ✅ Fetch Student Attendance (Only Teacher's Assigned Students)
// router.get("/students/history", authMiddleware(["Teacher"]), getStudentAttendanceForTeacher);

// // ✅ Get Attendance (Super Admin & Teachers)
// router.get("/", authMiddleware(["SuperAdmin", "Admin", "Teacher"]), getAttendance);

// // ✅ Bulk Attendance Upload (Only Teachers)
// router.post("/bulk-upload", authMiddleware(["Teacher"]), upload.single("file"), bulkAttendanceUpload);

// // ✅ Generate Attendance Report
// router.get("/report", authMiddleware(["SuperAdmin", "Admin"]), generateAttendanceReport);

// // ✅ Get All Student Attendance (SuperAdmin)
// router.get("/students", authMiddleware(["SuperAdmin", "Admin"]), getStudentsAttendance);

// // ✅ Get All Teacher Attendance (SuperAdmin)
// router.get("/teachers", authMiddleware(["SuperAdmin", "Admin"]), getTeachersAttendance);

// // ✅ Get Attendance for a Student (Only Student)
// router.get("/student", authMiddleware(["Student"]), getStudentAttendance);

// // ✅ Notify Teacher of an Absence (Only Student)
// router.post("/student/notify", authMiddleware(["Student"]), notifyAbsence);

// module.exports = router;
