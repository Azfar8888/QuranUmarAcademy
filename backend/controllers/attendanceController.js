const Attendance = require("../models/attendanceModel");
const User = require("../models/userModel");
const XLSX = require("xlsx");
const fs = require("fs");
const sendEmail = require("../utils/emailService");  // Import email function


exports.markAttendance = async (req, res) => {
  try {
    const {
      studentIds,
      teacherId,
      status,
      arrivalTime,
      late,
      lateByMinutes
    } = req.body;
    const role = req.user.role;

    const validStatuses = ["Present", "Absent", "Late", "Excused"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid attendance status" });
    }

    const attendanceRecords = [];
    const emailPromises = [];

    const todayDate = new Date().toLocaleDateString();

    // ✅ TEACHER ATTENDANCE
    if (teacherId) {
      const teacher = await User.findById(teacherId);
      if (!teacher || teacher.role !== "Teacher") {
        return res.status(404).json({ message: "Teacher not found" });
      }

      const attendance = await Attendance.create({
        teacher: teacher._id,
        status,
        arrivalTime: arrivalTime || null,
        late: late || false,
        lateByMinutes: late ? lateByMinutes || 0 : 0,
      });

      attendanceRecords.push(attendance);

      const arrivalText = arrivalTime ? `<p>Arrival Time: <strong>${arrivalTime}</strong></p>` : "";
      const lateText = late ? `<p><strong>Late by ${lateByMinutes} minutes</strong></p>` : "";

      emailPromises.push(
        sendEmail(
          teacher.email,
          `📋 Your Attendance Marked: ${status}`,
          "",
          `<p>Dear ${teacher.name},</p>
           <p>Your attendance for <strong>${todayDate}</strong> has been marked as <strong>${status}</strong>.</p>
           ${arrivalText}
           ${lateText}
           <p>Regards,<br>Umar Academy</p>`
        )
      );
    }

    // ✅ STUDENT ATTENDANCE
    if (Array.isArray(studentIds) && studentIds.length > 0) {
      const teacher = await User.findById(req.user.id);
      if (!teacher) {
        return res.status(404).json({ message: "Teacher not found" });
      }

      for (const studentId of studentIds) {
        const student = await User.findById(studentId);
        if (!student) continue;

        // If teacher, validate ownership
        if (role === "Teacher" && !teacher.assignedStudents.includes(studentId)) {
          continue;
        }

        const attendance = await Attendance.create({
          student: student._id,
          teacher: teacher._id,
          status,
        });

        attendanceRecords.push(attendance);

        emailPromises.push(
          sendEmail(
            student.email,
            `📋 Attendance Marked: ${status}`,
            "",
            `<p>Dear ${student.name},</p>
             <p>Your attendance has been marked as <strong style="color:${
               status === "Present" ? "green" : status === "Absent" ? "red" : "purple"
             }">${status}</strong> by <strong>${teacher.name}</strong> on <strong>${todayDate}</strong>.</p>
             <p>Regards,<br>Umar Academy</p>`
          )
        );

        emailPromises.push(
          sendEmail(
            teacher.email,
            `✅ Attendance Logged for ${student.name}`,
            "",
            `<p>You marked attendance for <strong>${student.name}</strong> as <strong>${status}</strong> on <strong>${todayDate}</strong>.</p>
             <p>Regards,<br>Umar Academy</p>`
          )
        );
      }
    }

    await Promise.all(emailPromises);

    res.status(201).json({
      message: "✅ Attendance marked & notifications sent",
      attendanceRecords,
    });
  } catch (error) {
    console.error("❌ Attendance error:", error);
    res.status(500).json({ message: "Failed to mark attendance", error: error.message });
  }
};





// exports.markAttendance = async (req, res) => {
//   try {
//     const { studentIds, status } = req.body;
//     console.log("➡️ Received attendance request:", { studentIds, status });

//     const allowedRoles = ["Teacher", "Admin", "SuperAdmin"];
//     if (!allowedRoles.includes(req.user.role)) {
//       console.log("❌ Not allowed to mark attendance. Role:", req.user.role);
//       return res.status(403).json({ message: "You are not allowed to mark attendance" });
//     }

//     const validStatuses = ["Present", "Absent", "Late", "Excused"];
//     if (!validStatuses.includes(status)) {
//       console.log("❌ Invalid status:", status);
//       return res.status(400).json({ message: "Invalid attendance status" });
//     }

//     const teacher = await User.findById(req.user.id);
//     if (!teacher) {
//       console.log("❌ Teacher/Admin not found");
//       return res.status(404).json({ message: "User not found" });
//     }

//     const attendanceRecords = [];
//     const emailPromises = [];

//     for (const studentId of studentIds) {
//       const student = await User.findById(studentId);
//       if (!student) {
//         console.log(`❌ Student not found: ${studentId}`);
//         continue;
//       }

//       // If Teacher, validate assigned students
//       if (req.user.role === "Teacher" && !teacher.assignedStudents.includes(studentId)) {
//         console.log(`⛔ Unauthorized: ${studentId} not assigned to ${teacher.name}`);
//         continue;
//       }

//       // Create attendance
//       const attendance = await Attendance.create({
//         student: student._id,
//         teacher: teacher._id,
//         status,
//       });

//       attendanceRecords.push(attendance);

//       const date = new Date().toLocaleDateString();

//       // Prepare student email
//       emailPromises.push(
//         sendEmail(
//           student.email,
//           `📋 Attendance Marked: ${status}`,
//           "",
//           `<p>Dear ${student.name},</p>
//            <p>Your attendance has been marked as <strong style="color:${
//              status === "Present" ? "green" : status === "Absent" ? "red" : "purple"
//            }">${status}</strong> by <strong>${teacher.name}</strong> on <strong>${date}</strong>.</p>
//            <p>Regards,<br>Umar Academy</p>`
//         ).then(() => {
//           console.log(`✅ Email sent to student: ${student.email}`);
//         }).catch((err) => {
//           console.error("❌ Failed to send email to student:", err.message);
//         })
//       );

//       // Prepare teacher email
//       emailPromises.push(
//         sendEmail(
//           teacher.email,
//           `✅ Attendance Logged for ${student.name}`,
//           "",
//           `<p>You marked attendance for <strong>${student.name}</strong> as <strong>${status}</strong> on <strong>${date}</strong>.</p>
//            <p>Regards,<br>Umar Academy</p>`
//         ).then(() => {
//           console.log(`✅ Email sent to teacher: ${teacher.email}`);
//         }).catch((err) => {
//           console.error("❌ Failed to send email to teacher:", err.message);
//         })
//       );
//     }

//     // Wait for all emails to be sent
//     await Promise.all(emailPromises);

//     res.status(201).json({
//       message: "✅ Attendance marked & notifications sent",
//       attendanceRecords,
//     });

//   } catch (error) {
//     console.error("❌ Attendance error:", error);
//     res.status(500).json({ message: "Failed to mark attendance", error: error.message });
//   }
// };


// Get Attendance (Filter by Teacher & Date)
exports.getAttendance = async (req, res) => {
  try {
    const { teacherId, date } = req.query;
    let filter = {};

    if (teacherId) filter.teacher = teacherId;
    if (date) filter.date = { $gte: new Date(date), $lt: new Date(date).setHours(23, 59, 59, 999) };

    const attendanceRecords = await Attendance.find(filter).populate("student", "name email").populate("teacher", "name email");

    res.status(200).json(attendanceRecords);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Bulk Attendance Upload (Only Teacher)
exports.bulkAttendanceUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Please upload a CSV or Excel file" });
    }

    // Read the uploaded file
    const filePath = req.file.path;
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const validStatuses = ["Present", "Absent", "Late", "Excused"];
    let attendanceRecords = [];

    for (const row of sheet) {
      const { StudentID, Status } = row;

      if (!StudentID || !Status || !validStatuses.includes(Status)) {
        return res.status(400).json({ message: "Invalid file format. Ensure StudentID and Status are correct." });
      }

      // Check if student exists
      const student = await User.findById(StudentID);
      if (!student || student.role !== "Student") {
        return res.status(400).json({ message: `Invalid Student ID: ${StudentID}` });
      }

      // Create attendance record
      const attendance = await Attendance.create({
        student: StudentID,
        teacher: req.user.id,
        status: Status
      });

      attendanceRecords.push(attendance);
    }

    // Delete the uploaded file after processing
    fs.unlinkSync(filePath);

    res.status(201).json({ message: "Bulk attendance uploaded successfully", attendanceRecords });
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

// Mark Attendance for Allocated Students (Only Teacher)
// exports.markAttendanceForStudents = async (req, res) => {
//   try {
//     const { studentIds, status } = req.body;

//     if (req.user.role !== "Teacher") {
//       return res.status(403).json({ message: "Only Teachers can mark attendance" });
//     }

//     // Validate status
//     const validStatuses = ["Present", "Absent", "Late", "Excused"];
//     if (!validStatuses.includes(status)) {
//       return res.status(400).json({ message: "Invalid attendance status" });
//     }

//     // Ensure students belong to the teacher
//     const teacher = await User.findById(req.user.id);
//     const unauthorizedStudents = studentIds.filter(
//       (id) => !teacher.assignedStudents.includes(id)
//     );

//     if (unauthorizedStudents.length > 0) {
//       return res.status(403).json({ message: "You can only mark attendance for your assigned students" });
//     }

//     // Create attendance records for multiple students
//     const attendanceRecords = await Promise.all(
//       studentIds.map(async (studentId) => {
//         return await Attendance.create({
//           student: studentId,
//           teacher: req.user.id,
//           status
//         });
//       })
//     );

//     res.status(201).json({ message: "Attendance marked successfully", attendanceRecords });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

exports.markAttendanceForStudents = async (req, res) => {
  try {
    const { studentIds, status } = req.body;

    if (req.user.role !== "Teacher") {
      return res.status(403).json({ message: "Only Teachers can mark attendance" });
    }

    const validStatuses = ["Present", "Absent", "Late", "Excused"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid attendance status" });
    }

    const teacher = await User.findById(req.user.id);
    const unauthorizedStudents = studentIds.filter(id => !teacher.assignedStudents.includes(id));

    if (unauthorizedStudents.length > 0) {
      return res.status(403).json({ message: "You can only mark attendance for your assigned students" });
    }

    const attendanceRecords = [];

    for (const studentId of studentIds) {
      const student = await User.findById(studentId);
      const attendance = await Attendance.create({
        student: student._id,
        teacher: teacher._id,
        status,
      });

      attendanceRecords.push(attendance);

      const date = new Date().toLocaleDateString();

      // ✅ Send to student
      await sendEmail(
        student.email,
        `📋 Attendance Marked: ${status}`,
        "",
        `<p>Dear ${student.name},</p>
         <p>Your attendance has been marked as <strong style="color:${
           status === "Present" ? "green" : status === "Absent" ? "red" : "purple"
         }">${status}</strong> by <strong>${teacher.name}</strong> on <strong>${date}</strong>.</p>
         <p>Regards,<br>Umar Academy</p>`
      );

      // ✅ Send to teacher
      await sendEmail(
        teacher.email,
        `✅ Attendance Logged for ${student.name}`,
        "",
        `<p>You marked attendance for <strong>${student.name}</strong> as <strong>${status}</strong> on <strong>${date}</strong>.</p>
         <p>Regards,<br>Umar Academy</p>`
      );

      console.log(`📨 Sent attendance emails to ${student.email} and ${teacher.email}`);
    }

    res.status(201).json({ message: "✅ Attendance marked & notifications sent", attendanceRecords });
  } catch (error) {
    console.error("❌ Attendance error:", error);
    res.status(500).json({ error: error.message });
  }
};


// View Attendance History for Allocated Students (Only Teacher)
exports.viewAttendanceHistory = async (req, res) => {
  try {
    if (req.user.role !== "Teacher") {
      return res.status(403).json({ message: "Only Teachers can view attendance history" });
    }

    const teacher = await User.findById(req.user.id);
    const attendanceRecords = await Attendance.find({ teacher: req.user.id })
      .populate("student", "name email")
      .sort({ date: -1 });

    res.status(200).json(attendanceRecords);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Attendance for a Student (Only Student)
exports.getStudentAttendance = async (req, res) => {
  try {
    if (req.user.role !== "Student") {
      return res.status(403).json({ message: "Only Students can view attendance" });
    }

    const attendanceRecords = await Attendance.find({ student: req.user.id })
      .populate("teacher", "name email")
      .sort({ date: -1 });

    res.status(200).json(attendanceRecords);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Notify Teacher of an Absence (Only Student)
exports.notifyAbsence = async (req, res) => {
  try {
    const { date, reason } = req.body;

    if (req.user.role !== "Student") {
      return res.status(403).json({ message: "Only Students can notify teachers of absences" });
    }

    const attendance = await Attendance.findOne({ student: req.user.id, date });
    if (!attendance) {
      return res.status(404).json({ message: "No attendance record found for the specified date" });
    }

    // Update attendance record with the reason
    attendance.reason = reason;
    attendance.status = "Excused";
    await attendance.save();

    res.status(200).json({ message: "Teacher notified successfully", attendance });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Attendance Records
exports.getAttendance = async (req, res) => {
  try {
    const { teacher, student, date } = req.query;
    let query = {};

    if (teacher) query.teacher = teacher;
    if (student) query.student = student;
    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      query.date = { $gte: start, $lte: end };
    }

    const attendanceRecords = await Attendance.find(query).populate("student teacher", "name email");
    res.json(attendanceRecords);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.editAttendance = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    // Ensure a valid status is provided
    const validStatuses = ["Present", "Absent", "Late", "Excused"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid attendance status" });
    }

    // Find and update attendance record
    const updatedAttendance = await Attendance.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedAttendance) {
      return res.status(404).json({ message: "Attendance record not found" });
    }

    res.status(200).json(updatedAttendance);
  } catch (error) {
    console.error("Error updating attendance:", error);
    res.status(500).json({ error: "Failed to update attendance" });
  }
};
exports.updateAttendance = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  console.log("✅ Received PUT request to update attendance");
  console.log("Attendance ID:", id);
  console.log("New Status:", status);

  if (!id) {
      console.error("❌ Error: Attendance ID missing");
      return res.status(400).json({ error: "Attendance ID is required" });
  }

  try {
      const attendance = await Attendance.findByIdAndUpdate(id, { status }, { new: true });

      if (!attendance) {
          console.error("❌ Error: Attendance record not found");
          return res.status(404).json({ error: "Attendance record not found" });
      }

      console.log("✅ Attendance Updated Successfully:", attendance);
      res.status(200).json(attendance);
  } catch (error) {
      console.error("❌ Error updating attendance:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getStudentsAttendance = async (req, res) => {
  try {
    const studentAttendance = await Attendance.find({ role: "Student" }); // Adjust query based on DB
    res.status(200).json(studentAttendance);
  } catch (error) {
    res.status(500).json({ message: "Error fetching student attendance" });
  }
};

// exports.markTeacherAttendance = async (req, res) => {
//   try {
//     const { status } = req.body;

//     if (req.user.role !== "SuperAdmin") {
//       return res.status(403).json({ message: "Only SuperAdmin can mark teacher attendance" });
//     }

//     await Attendance.create({
//       teacher: req.user.id,
//       status,
//     });

//     res.status(201).json({ message: "Teacher attendance marked successfully" });
//   } catch (error) {
//     console.error("Error marking teacher attendance:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// exports.markTeacherAttendance = async (req, res) => {
//   try {
//     const { teacherId, status, arrivalTime, late, lateByMinutes } = req.body;

//     if (req.user.role !== "SuperAdmin") {
//       return res.status(403).json({ message: "Only SuperAdmin can mark teacher attendance" });
//     }

//     if (!teacherId || !status) {
//       return res.status(400).json({ message: "Teacher and status are required" });
//     }

//     const attendanceData = {
//       teacher: teacherId,
//       status,
//     };

//     if (status === "Present") {
//       attendanceData.arrivalTime = arrivalTime;
//       attendanceData.late = !!late;
//       attendanceData.lateByMinutes = late ? lateByMinutes || 0 : 0;
//     }

//     await Attendance.create(attendanceData);

//     res.status(201).json({ message: "Teacher attendance marked successfully" });
//   } catch (error) {
//     console.error("Error marking teacher attendance:", error);
//     res.status(500).json({ error: error.message });
//   }
// };








exports.markStudentAttendance = async (req, res) => {
  try {
    const { studentIds, status } = req.body;

    if (req.user.role !== "Teacher") {
      return res.status(403).json({ message: "Only Teachers can mark student attendance" });
    }

    if (!studentIds || studentIds.length === 0) {
      return res.status(400).json({ message: "No students selected" });
    }

    await Promise.all(
      studentIds.map(async (studentId) => {
        await Attendance.create({
          student: studentId,
          teacher: req.user.id,
          status,
        });
      })
    );

    res.status(201).json({ message: "Student attendance marked successfully" });
  } catch (error) {
    console.error("Error marking student attendance:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getTeacherAttendance = async (req, res) => {
  try {
    if (req.user.role !== "Teacher") {
      return res.status(403).json({ message: "Only Teachers can view their own attendance" });
    }

    const attendanceRecords = await Attendance.find({ teacher: req.user.id }).sort({ date: -1 });

    res.status(200).json(attendanceRecords);
  } catch (error) {
    console.error("Error fetching teacher attendance:", error);
    res.status(500).json({ error: error.message });
  }
};
exports.getStudentAttendanceForTeacher = async (req, res) => {
  try {
    if (req.user.role !== "Teacher") {
      return res.status(403).json({ message: "Only Teachers can view student attendance" });
    }

    const teacher = await User.findById(req.user.id).populate("assignedStudents");
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    const studentIds = teacher.assignedStudents.map(student => student._id);
    const attendanceRecords = await Attendance.find({ student: { $in: studentIds } })
      .populate("student", "name email")
      .sort({ date: -1 });

    res.status(200).json(attendanceRecords);
  } catch (error) {
    console.error("Error fetching student attendance:", error);
    res.status(500).json({ error: error.message });
  }
};
