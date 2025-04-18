const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const multer = require("multer");
const xlsx = require("xlsx");
const fs = require("fs");


// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// Register User (Only SuperAdmin)
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate role
    if (!["SuperAdmin", "Admin", "Teacher", "Student"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user
    const user = await User.create({ name, email, password: hashedPassword, role });

    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Error registering user" });
  }
};

// Login User
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);
    res.json({ token, role: user.role });
  } catch (err) {
    console.error("Error logging in:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get All Users (SuperAdmin Only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update User Role
exports.updateUserRole = async (req, res) => {
  try {
    const { userId, newRole } = req.body;

    if (!["Admin", "Teacher", "Student"].includes(newRole)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const updatedUser = await User.findByIdAndUpdate(userId, { role: newRole }, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Role updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Set up file upload with Multer
const upload = multer({ dest: "uploads/" });

// Import Users via Excel/CSV
exports.importUsers = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Please upload a file" });

    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const users = await Promise.all(
      data.map(async (row) => {
        const hashedPassword = await bcrypt.hash(row.password, 10);
        return User.create({
          name: row.name,
          email: row.email,
          password: hashedPassword,
          role: row.role,
        });
      })
    );

    fs.unlinkSync(req.file.path); // Remove file after processing
    res.json({ message: "Users imported successfully", users });
  } catch (error) {
    console.error("Error importing users:", error);
    res.status(500).json({ message: "Failed to import users" });
  }
};

// Export Users to Excel
exports.exportUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    const worksheet = xlsx.utils.json_to_sheet(users);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "Users");

    const filePath = "exports/users.xlsx";
    xlsx.writeFile(workbook, filePath);

    res.download(filePath, "users.xlsx", () => {
      fs.unlinkSync(filePath);
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to export users" });
  }
};

// exports.registerUser = async (req, res) => {
//   try {
//     const { name, email, password, role } = req.body;

//     // Validate role
//     if (!["SuperAdmin", "Admin", "Teacher", "Student"].includes(role)) {
//       return res.status(400).json({ message: "Invalid role" });
//     }

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Save the user with the hashed password
//     const user = await User.create({ name, email, password: hashedPassword, role });

//     res.status(201).json({ message: "User created successfully", user });
//   } catch (error) {
//     console.error("Error registering user:", error);
//     res.status(500).json({ message: "Error registering user" });
//   }
// };

// exports.loginUser = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const isPasswordMatch = await bcrypt.compare(password, user.password);
//     if (!isPasswordMatch) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
//       expiresIn: "1h",
//     });

//     res.json({ token, role: user.role });
//   } catch (err) {
//     console.error("Error logging in:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };



// // Get All Users (SuperAdmin, Admin)
// exports.getAllUsers = async (req, res) => {
//   try {
//     const users = await User.find().select("-password");
//     res.json(users);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// Update User (SuperAdmin, Admin)
// exports.updateUser = async (req, res) => {
//   try {
//     const { name, role } = req.body;
//     const user = await User.findByIdAndUpdate(req.params.id, { name, role }, { new: true });

//     if (!user) return res.status(404).json({ message: "User not found" });
//     res.json(user);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// Delete User (Only SuperAdmin)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Assign Role Function (Only SuperAdmin)
exports.assignRole = async (req, res) => {
  try {
    const { userId, newRole } = req.body;

    // Ensure requester is SuperAdmin
    if (req.user.role !== "SuperAdmin") {
      return res.status(403).json({ message: "Only SuperAdmin can assign roles" });
    }

    // Validate the new role
    const validRoles = ["Admin", "Teacher", "Student"];
    if (!validRoles.includes(newRole)) {
      return res.status(400).json({ message: "Invalid role provided" });
    }

    // Find the user and update their role
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role: newRole },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Role updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Student Profile (Only Student)
exports.getStudentProfile = async (req, res) => {
  try {
    if (req.user.role !== "Student") {
      return res.status(403).json({ message: "Only Students can view their profile" });
    }

    const student = await User.findById(req.user.id)
      .populate("assignedTeacher", "name email")
      .populate("assignedAdmin", "name email");

    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Student Profile (Only Student)
exports.updateStudentProfile = async (req, res) => {
  try {
    if (req.user.role !== "Student") {
      return res.status(403).json({ message: "Only Students can update their profile" });
    }

    const { name, email, phoneNumber } = req.body;
    const updatedProfile = await User.findByIdAndUpdate(
      req.user.id,
      { name, email, phoneNumber },
      { new: true }
    );

    res.status(200).json({ message: "Profile updated successfully", updatedProfile });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.assignStudentsToTeacher = async (req, res) => {
  try {
    const { teacherId, studentIds } = req.body;

    // Validate teacher
    const teacher = await User.findById(teacherId);
    if (!teacher || teacher.role !== "Teacher") {
      return res.status(404).json({ message: "Teacher not found or invalid role" });
    }

    // Validate students
    const students = await User.find({ _id: { $in: studentIds }, role: "Student" });
    if (students.length !== studentIds.length) {
      return res.status(400).json({ message: "One or more students not found or invalid" });
    }

    // Assign students to teacher
    teacher.assignedStudents = studentIds;
    await teacher.save();

    res.status(200).json({ message: "Students assigned successfully", teacher });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// exports.getAssignedStudents = async (req, res) => {
//   try {
//     const { teacherId } = req.params;

//     // Find teacher with assigned students
//     const teacher = await User.findById(teacherId).populate("assignedStudents", "name _id");

//     if (!teacher) {
//       return res.status(404).json({ message: "Teacher not found" });
//     }

//     if (!teacher.assignedStudents || teacher.assignedStudents.length === 0) {
//       return res.status(200).json([]); // Return empty array if no students assigned
//     }

//     res.status(200).json(teacher.assignedStudents);
//   } catch (error) {
//     console.error("Error fetching assigned students:", error);
//     res.status(500).json({ error: "Server error fetching students" });
//   }
// };

exports.getAssignedStudents = async (req, res) => {
  try {
    const { teacherId } = req.params;
    console.log("Fetching students for teacher ID:", teacherId);

    // ✅ Ensure teacherId is provided
    if (!teacherId) {
      return res.status(400).json({ message: "Teacher ID is required" });
    }

    // 🔍 Fetch teacher with assigned students
    const teacher = await User.findById(teacherId).populate("assignedStudents");

    // ✅ Debugging log
    console.log("Teacher Found:", teacher);

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    // ✅ Return assigned students
    res.status(200).json(teacher.assignedStudents);
  } catch (error) {
    console.error("Error fetching assigned students:", error);
    res.status(500).json({ error: error.message });
  }
};

