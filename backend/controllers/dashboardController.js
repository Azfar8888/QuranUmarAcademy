const User = require("../models/userModel");
const Attendance = require("../models/attendanceModel");
const Homework = require("../models/homeworkModel");
const Notification = require("../models/notificationModel");

// Super Admin Dashboard
exports.getSuperAdminDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: "Student" });
    const totalTeachers = await User.countDocuments({ role: "Teacher" });
    const totalAdmins = await User.countDocuments({ role: "Admin" });

    res.status(200).json({ totalUsers, totalStudents, totalTeachers, totalAdmins });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Teacher Dashboard
exports.getTeacherDashboard = async (req, res) => {
  try {
    if (req.user.role !== "Teacher") {
      return res.status(403).json({ message: "Only Teachers can access this dashboard" });
    }

    const totalStudents = await User.countDocuments({ assignedTeacher: req.user.id });
    const totalHomework = await Homework.countDocuments({ teacher: req.user.id });
    const attendanceRecords = await Attendance.find({ teacher: req.user.id });

    res.status(200).json({ totalStudents, totalHomework, attendanceRecords });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Student Dashboard
exports.getStudentDashboard = async (req, res) => {
  try {
    if (req.user.role !== "Student") {
      return res.status(403).json({ message: "Only Students can access this dashboard" });
    }

    const totalHomework = await Homework.countDocuments({ students: req.user.id });
    const attendanceRecords = await Attendance.find({ student: req.user.id });
    const notifications = await Notification.find({ recipient: req.user.id });

    res.status(200).json({ totalHomework, attendanceRecords, notifications });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
