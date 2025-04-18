const User = require("../models/userModel");
const Attendance = require("../models/attendanceModel");
const Homework = require("../models/homeworkModel");
const fs = require("fs");
const path = require("path");

// Backup System Data (Users, Attendance, Homework)
exports.backupSystemData = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    const attendance = await Attendance.find();
    const homework = await Homework.find();

    const backupData = {
      users,
      attendance,
      homework,
      createdAt: new Date()
    };

    const backupFileName = `backup_${Date.now()}.json`;
    const backupFilePath = path.join(__dirname, "../reports", backupFileName);

    fs.writeFileSync(backupFilePath, JSON.stringify(backupData, null, 2));

    res.status(200).json({ message: "Backup created successfully", backupUrl: `/reports/${backupFileName}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Generate Admin Reports
exports.generateAdminReports = async (req, res) => {
  try {
    const { type, startDate, endDate } = req.query;

    let data = [];
    if (type === "attendance") {
      const filter = {};
      if (startDate && endDate) {
        filter.date = {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        };
      }
      data = await Attendance.find(filter).populate("student teacher", "name email");
    } else if (type === "homework") {
      data = await Homework.find().populate("teacher students", "name email");
    } else {
      return res.status(400).json({ message: "Invalid report type. Use 'attendance' or 'homework'." });
    }

    const reportFileName = `${type}_report_${Date.now()}.json`;
    const reportFilePath = path.join(__dirname, "../reports", reportFileName);

    fs.writeFileSync(reportFilePath, JSON.stringify(data, null, 2));

    res.status(200).json({ message: "Report generated successfully", reportUrl: `/reports/${reportFileName}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
