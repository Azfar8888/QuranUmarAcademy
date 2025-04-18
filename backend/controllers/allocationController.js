const User = require("../models/userModel");

// Assign Students to Teacher (Only SuperAdmin or Admin)
exports.assignStudentsToTeacher = async (req, res) => {
  try {
    const { teacherId, studentIds } = req.body;

    // Ensure the user making the request is SuperAdmin or Admin
    if (!["SuperAdmin", "Admin"].includes(req.user.role)) {
      return res.status(403).json({ message: "Only SuperAdmin or Admin can assign students" });
    }

    // Find the teacher and ensure they exist
    const teacher = await User.findById(teacherId);
    if (!teacher || teacher.role !== "Teacher") {
      return res.status(400).json({ message: "Invalid Teacher ID" });
    }

    // Ensure all students exist and are actually "Students"
    const students = await User.find({ _id: { $in: studentIds }, role: "Student" });
    if (students.length !== studentIds.length) {
      return res.status(400).json({ message: "One or more Student IDs are invalid" });
    }

    // Assign students to the teacher
    teacher.assignedStudents = studentIds;
    await teacher.save();

    res.status(200).json({ message: "Students assigned successfully", teacher });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Students Assigned to a Teacher (Only Teacher)
exports.getAssignedStudents = async (req, res) => {
  try {
    // Ensure the requester is a Teacher
    if (req.user.role !== "Teacher") {
      return res.status(403).json({ message: "Only Teachers can view assigned students" });
    }

    // Fetch the teacher along with assigned students
    const teacher = await User.findById(req.user.id).populate("assignedStudents", "name email");

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    res.status(200).json({ students: teacher.assignedStudents });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Students Assigned to a Teacher (Only Teacher)
exports.getTeacherStudents = async (req, res) => {
  try {
    if (req.user.role !== "Teacher") {
      return res.status(403).json({ message: "Only Teachers can view their students" });
    }

    const teacher = await User.findById(req.user.id).populate("assignedStudents", "name email notes");

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    res.status(200).json(teacher.assignedStudents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add Notes for a Student (Only Teacher)
exports.addStudentNote = async (req, res) => {
  try {
    const { studentId, note } = req.body;

    if (req.user.role !== "Teacher") {
      return res.status(403).json({ message: "Only Teachers can add notes for students" });
    }

    const teacher = await User.findById(req.user.id);
    if (!teacher || !teacher.assignedStudents.includes(studentId)) {
      return res.status(403).json({ message: "You can only add notes for your assigned students" });
    }

    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    student.notes = student.notes || [];
    student.notes.push({ note, createdBy: req.user.id, createdAt: new Date() });
    await student.save();

    res.status(200).json({ message: "Note added successfully", student });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
