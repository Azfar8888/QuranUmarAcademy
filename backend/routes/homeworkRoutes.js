// // const express = require("express");
// // const {
// //   assignHomework,
// //   updateHomework,
// //   getTeacherHomework,
// //   trackHomeworkSubmissions,
// //   getStudentHomework,
// //   getHomework
// // } = require("../controllers/homeworkController");
// // const authMiddleware = require("../middleware/authMiddleware");



// // const router = express.Router();
// // router.post("/", assignHomework);
// // // Assign Homework (Only Teacher)
// // router.post("/assign", authMiddleware(["Teacher"]), assignHomework);
// // router.post("/assign", authMiddleware(["SuperAdmin", "Teacher"]), assignHomework);

// // // Update Homework (Only Teacher)
// // router.put("/:id", authMiddleware(["Teacher"]), updateHomework);

// // // Get Homework Assigned by Teacher (Only Teacher)
// // router.get("/teacher", authMiddleware(["Teacher"]), getTeacherHomework);

// // // Track Homework Submissions (Only Teacher)
// // router.get("/:id/submissions", authMiddleware(["Teacher"]), trackHomeworkSubmissions);

// // // Get Homework Assigned to a Student (Only Student)
// // // router.get("/student", authMiddleware(["Student"]), getStudentHomework);

// // // router.get("/student/:id", authMiddleware(["Student"]), getStudentHomework);

// // //router.get("/student/:id", authMiddleware(["SuperAdmin", "Teacher", "Student"]), getStudentHomework);
// // router.get("/student/:studentId", authMiddleware(["SuperAdmin", "Teacher", "Student"]), getStudentHomework);
// // router.post("/", authMiddleware(["SuperAdmin", "Teacher"]), assignHomework);
// // router.get("/", authMiddleware(["SuperAdmin", "Teacher", "Student"]), getHomework);
// // router.get("/student/:id", authMiddleware(["SuperAdmin", "Teacher", "Student"]), getStudentHomework);
// // router.post("/assign", authMiddleware(["SuperAdmin", "Teacher"]), assignHomework);

// // module.exports = router;


// const express = require("express");
// const {
//   assignHomework,
//   updateHomework,
//   getStudentHomework,
//   getAllHomework,
// } = require("../controllers/homeworkController");
// const authMiddleware = require("../middleware/authMiddleware");

// const router = express.Router();

// // Assign Homework (Only Super Admin & Teachers)
// router.post("/assign", authMiddleware(["SuperAdmin", "Teacher"]), assignHomework);

// // Update Homework (Only Teachers)
// router.put("/update", authMiddleware(["SuperAdmin", "Teacher"]), updateHomework);
// router.put("/update/:id", updateHomework);

// // Get Homework for a Specific Student
// router.get("/student/:studentId", authMiddleware(["SuperAdmin", "Teacher", "Student"]), getStudentHomework);

// // Get All Homework (Super Admin)
// router.get("/", authMiddleware(["SuperAdmin"]), getAllHomework);

// module.exports = router;

const express = require("express");
const {
  assignHomework,
  updateHomework,
  getStudentHomework,
  getAllHomework,
  getTeacherHomework
} = require("../controllers/homeworkController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Assign Homework (Only Super Admin & Teachers)
router.post("/assign", authMiddleware(["SuperAdmin", "Teacher"]), assignHomework);

// Update Homework (Only Teachers)
router.put("/update/:id", authMiddleware(["SuperAdmin", "Teacher"]), updateHomework);

// Get Homework for a Specific Student
router.get("/student/:studentId", authMiddleware(["SuperAdmin", "Teacher", "Student"]), getStudentHomework);

// Get All Homework (Super Admin)
router.get("/", authMiddleware(["SuperAdmin"]), getAllHomework);

router.get("/teacher/:teacherId", authMiddleware(["Teacher"]), getTeacherHomework);


module.exports = router;

