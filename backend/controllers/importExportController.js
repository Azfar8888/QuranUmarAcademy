const XLSX = require("xlsx");
const fs = require("fs");
const User = require("../models/userModel");
const Attendance = require("../models/attendanceModel");
const Homework = require("../models/homeworkModel");
const PDFDocument = require("pdfkit");

// Import Students/Teachers from Excel/CSV
exports.importUsers = async (req, res) => {
  try {
    const filePath = req.file.path;
    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(sheet);

    for (let row of data) {
      await User.create({
        name: row.Name,
        email: row.Email,
        password: "default123", // Assign a default password
        role: row.Role
      });
    }

    fs.unlinkSync(filePath); // Delete file after processing
    res.status(200).json({ message: "Users imported successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Export Attendance Report as Excel
exports.exportAttendance = async (req, res) => {
  try {
    const attendanceRecords = await Attendance.find()
      .populate("student", "name email")
      .populate("teacher", "name email");

    const reportData = attendanceRecords.map((record) => ({
      StudentName: record.student.name,
      StudentEmail: record.student.email,
      TeacherName: record.teacher.name,
      Date: record.date.toISOString().split("T")[0],
      Status: record.status
    }));

    const worksheet = XLSX.utils.json_to_sheet(reportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance Report");

    const filePath = `uploads/attendance_report_${Date.now()}.xlsx`;
    XLSX.writeFile(workbook, filePath);

    res.status(200).json({ message: "Attendance report generated successfully", reportUrl: `/${filePath}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Export Homework Report as Excel
exports.exportHomework = async (req, res) => {
  try {
    const homeworkRecords = await Homework.find()
      .populate("students", "name email")
      .populate("teacher", "name email");

    const reportData = homeworkRecords.map((hw) => ({
      HomeworkTitle: hw.title,
      Description: hw.description,
      DueDate: hw.dueDate.toISOString().split("T")[0],
      TeacherName: hw.teacher.name,
      AssignedStudents: hw.students.map((s) => s.name).join(", ")
    }));

    const worksheet = XLSX.utils.json_to_sheet(reportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Homework Report");

    const filePath = `uploads/homework_report_${Date.now()}.xlsx`;
    XLSX.writeFile(workbook, filePath);

    res.status(200).json({ message: "Homework report generated successfully", reportUrl: `/${filePath}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Export Attendance Report as PDF
exports.exportAttendancePDF = async (req, res) => {
  try {
    const doc = new PDFDocument();
    const filePath = `uploads/attendance_report_${Date.now()}.pdf`;

    doc.pipe(fs.createWriteStream(filePath));
    doc.fontSize(16).text("Attendance Report", { align: "center" });

    const attendanceRecords = await Attendance.find()
      .populate("student", "name email")
      .populate("teacher", "name email");

    attendanceRecords.forEach((record) => {
      doc
        .fontSize(12)
        .text(`Student: ${record.student.name} (${record.student.email})`)
        .text(`Teacher: ${record.teacher.name}`)
        .text(`Date: ${record.date.toISOString().split("T")[0]}`)
        .text(`Status: ${record.status}`)
        .moveDown();
    });

    doc.end();
    res.status(200).json({ message: "Attendance PDF generated successfully", reportUrl: `/${filePath}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
