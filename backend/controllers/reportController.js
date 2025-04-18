const Attendance = require("../models/attendanceModel");
const Homework = require("../models/homeworkModel");
const User = require("../models/userModel");
const XLSX = require("xlsx");
const fs = require("fs");

// Generate Performance Report
exports.generatePerformanceReport = async (req, res) => {
  try {
    const { userId, startDate, endDate } = req.query;
    let filter = { student: userId };

    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // Fetch Attendance Data
    const attendanceRecords = await Attendance.find(filter)
      .populate("teacher", "name email");

    // Fetch Homework Data
    const homeworkRecords = await Homework.find({ students: userId })
      .populate("teacher", "name email");

    if (!attendanceRecords.length && !homeworkRecords.length) {
      return res.status(404).json({ message: "No performance records found for the given criteria." });
    }

    // Prepare Report Data
    const reportData = [];

    attendanceRecords.forEach(record => {
      reportData.push({
        Type: "Attendance",
        Date: record.date.toISOString().split("T")[0],
        Status: record.status,
        Teacher: record.teacher.name
      });
    });

    homeworkRecords.forEach(hw => {
      reportData.push({
        Type: "Homework",
        Title: hw.title,
        DueDate: hw.dueDate.toISOString().split("T")[0],
        Status: hw.status,
        Teacher: hw.teacher.name
      });
    });

    // Convert JSON to Excel
    const worksheet = XLSX.utils.json_to_sheet(reportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Performance Report");

    const filePath = `reports/performance_report_${userId}_${Date.now()}.xlsx`;
    XLSX.writeFile(workbook, filePath);

    res.status(200).json({
      message: "Performance report generated successfully",
      reportUrl: `/${filePath}`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Generate Attendance Report
exports.generateAttendanceReport = async (req, res) => {
  try {
    const { teacherId, studentId, startDate, endDate } = req.query;
    let filter = {};

    if (teacherId) filter.teacher = teacherId;
    if (studentId) filter.student = studentId;
    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const attendanceRecords = await Attendance.find(filter)
      .populate("student", "name email")
      .populate("teacher", "name email");

    if (!attendanceRecords.length) {
      return res.status(404).json({ message: "No attendance records found for the given criteria." });
    }

    // Create Report Data
    const reportData = attendanceRecords.map((record) => ({
      StudentName: record.student.name,
      StudentEmail: record.student.email,
      TeacherName: record.teacher.name,
      TeacherEmail: record.teacher.email,
      Date: record.date.toISOString().split("T")[0],
      Status: record.status
    }));

    // Convert JSON to Excel
    const worksheet = XLSX.utils.json_to_sheet(reportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance Report");

    const filePath = `reports/attendance_report_${Date.now()}.xlsx`;
    XLSX.writeFile(workbook, filePath);

    res.status(200).json({
      message: "Attendance report generated successfully",
      reportUrl: `/${filePath}`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Generate Homework Report
exports.generateHomeworkReport = async (req, res) => {
  try {
    const { studentId, startDate, endDate } = req.query;
    let filter = {};

    if (studentId) filter.students = studentId;
    if (startDate && endDate) {
      filter.dueDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const homeworkRecords = await Homework.find(filter)
      .populate("students", "name email")
      .populate("teacher", "name email");

    if (!homeworkRecords.length) {
      return res.status(404).json({ message: "No homework records found for the given criteria." });
    }

    // Create Report Data
    const reportData = homeworkRecords.map((hw) => ({
      HomeworkTitle: hw.title,
      Description: hw.description,
      DueDate: hw.dueDate.toISOString().split("T")[0],
      TeacherName: hw.teacher.name,
      AssignedStudents: hw.students.map((s) => s.name).join(", "),
      Status: hw.status
    }));

    // Convert JSON to Excel
    const worksheet = XLSX.utils.json_to_sheet(reportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Homework Report");

    const filePath = `reports/homework_report_${Date.now()}.xlsx`;
    XLSX.writeFile(workbook, filePath);

    res.status(200).json({
      message: "Homework report generated successfully",
      reportUrl: `/${filePath}`
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
