const express = require("express");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const User = require("../models/userModel"); // Ensure the correct path
const {
  assignRole,
  registerUser,
  loginUser,
  updateUser,
  deleteUser,
  getStudentProfile,
  importUsers,
  exportUsers,
  getAllUsers,
  updateStudentProfile,
  assignStudentsToTeacher,
  getAssignedStudents
} = require("../controllers/userController");
const { googleLogin} = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const upload = multer({ dest: "uploads/" });
const router = express.Router();
//const { getAssignedStudents } = require("../controllers/homeworkController");
//const { getAssignedStudents } = require("../controllers/userController");
// SuperAdmin Routes
// POST register (public registration)
router.post("/register", registerUser); // No authentication needed
// POST Google Login
router.post("/google-login", googleLogin);

//router.post("/register", authMiddleware(["SuperAdmin"]), registerUser);
router.put("/assign-role", authMiddleware(["SuperAdmin"]), assignRole);
router.post("/assign-students", assignStudentsToTeacher);
//router.get("/assigned-students/:teacherId", authMiddleware, getAssignedStudents);
//router.get("/assigned-students/:teacherId", authMiddleware, getAssignedStudents);
router.get("/assigned-students/:teacherId", getAssignedStudents);
//router.get("/assigned-students/:teacherId", authMiddleware(["SuperAdmin, Teacher"]), getAssignedStudents);

router.get("/me", authMiddleware(["SuperAdmin", "Teacher", "Admin"]), async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// User Management
router.get("/", authMiddleware(["SuperAdmin"]), getAllUsers);
router.post("/import", authMiddleware(["SuperAdmin"]), upload.single("file"), importUsers);
router.get("/export", authMiddleware(["SuperAdmin"]), exportUsers);

// Login
router.post("/login", loginUser);

router.get("/", authMiddleware(["SuperAdmin"]), async (req, res) => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });

// Add a New User (SuperAdmin Only)
router.post("/", authMiddleware(["SuperAdmin"]), async (req, res) => {
  const { name, email, role, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, role, password: hashedPassword });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    console.error("Error adding user:", err);
    res.status(500).json({ message: "Failed to add user" });
  }
});

// Delete User (SuperAdmin Only)
router.delete("/:id", authMiddleware(["SuperAdmin"]), async (req, res) => {
    try {
      console.log("Attempting to delete user with ID:", req.params.id);
  
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) {
        console.log("User not found");
        return res.status(404).json({ message: "User not found" });
      }
  
      console.log("User deleted successfully:", user);
      res.json({ message: "User deleted successfully" });
    } catch (err) {
      console.error("Error deleting user:", err.message);
      res.status(500).json({ message: "Failed to delete user" });
    }
  });
  

// Update User (SuperAdmin and Admin)
// router.put("/:id", authMiddleware(["SuperAdmin", "Admin"]), updateUser);
router.put("/:id", authMiddleware(["SuperAdmin"]), async (req, res) => {
    const { name, email, role } = req.body;
  
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { name, email, role },
        { new: true, runValidators: true }
      );
  
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.json(updatedUser);
    } catch (err) {
      console.error("Error updating user:", err);
      res.status(500).json({ message: "Failed to update user" });
    }
  });
  

// Student Routes
router.get("/student/profile", authMiddleware(["Student"]), getStudentProfile);
router.put("/student/profile", authMiddleware(["Student"]), updateStudentProfile);

module.exports = router;
