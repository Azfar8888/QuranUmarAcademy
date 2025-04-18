// const Homework = require("../models/homeworkModel");

// // ✅ Assign Homework (Super Admin & Teacher)
// exports.assignHomework = async (req, res) => {
//   try {
//     const { teacherId, studentId, date, content } = req.body;

//     if (!teacherId || !studentId || !date || !content) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     const homework = new Homework({
//       teacher: teacherId,
//       student: studentId,
//       date,
//       content,
//     });

//     await homework.save();
//     res.status(201).json({ message: "Homework assigned successfully", homework });
//   } catch (error) {
//     console.error("Error assigning homework:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// // ✅ Get Homework for a Specific Student
// exports.getStudentHomework = async (req, res) => {
//   try {
//     const { studentId } = req.params;
//     const homework = await Homework.find({ student: studentId }).populate("teacher", "name");
    
//     res.status(200).json(homework);
//   } catch (error) {
//     console.error("Error fetching student homework:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// // ✅ Update Homework
// exports.updateHomework = async (req, res) => {
//   try {
//     const { content } = req.body;

//     const updatedHomework = await Homework.findByIdAndUpdate(
//       req.params.id,
//       { content },
//       { new: true }
//     );

//     if (!updatedHomework) {
//       return res.status(404).json({ message: "Homework not found" });
//     }

//     res.status(200).json({ message: "Homework updated successfully", updatedHomework });
//   } catch (error) {
//     console.error("Error updating homework:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// // ✅ Get All Homework (Super Admin)
// exports.getAllHomework = async (req, res) => {
//   try {
//     const homework = await Homework.find().populate("teacher student", "name email");
//     res.status(200).json(homework);
//   } catch (error) {
//     console.error("Error fetching homework:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

const Homework = require("../models/homeworkModel");
const sendEmail = require("../utils/emailService");
const User = require("../models/userModel");


// ✅ Assign Homework (Super Admin & Teacher)
// exports.assignHomework = async (req, res) => {
//   try {
//     const { teacherId, studentId, date, sabaq, sabqi, manzil, comment } = req.body;

//     if (!teacherId || !studentId || !date) {
//       return res.status(400).json({ message: "Teacher, Student, and Date are required" });
//     }

//     const homework = new Homework({
//       teacher: teacherId,
//       student: studentId,
//       date,
//       sabaq: sabaq || "",
//       sabqi: sabqi || "",
//       manzil: manzil || "",
//       comment: comment || "",
//     });

//     await homework.save();
//     res.status(201).json({ message: "Homework assigned successfully", homework });
//   } catch (error) {
//     console.error("Error assigning homework:", error);
//     res.status(500).json({ error: error.message });
//   }
// };


exports.assignHomework = async (req, res) => {
  try {
    const { teacherId, studentId, date, sabaq, sabqi, manzil, comment } = req.body;

    if (!teacherId || !studentId || !date) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const teacher = await User.findById(teacherId);
    const student = await User.findById(studentId);

    if (!teacher || !student) {
      return res.status(404).json({ message: "Teacher or Student not found" });
    }

    const newHomework = new Homework({
      teacher: teacherId,
      student: studentId,
      date: new Date(date),
      sabaq,
      sabqi,
      manzil,
      comment,
    });

    await newHomework.save();

    // ✅ Email content
    const subject = `📘 New Homework Assigned on ${new Date(date).toLocaleDateString()}`;
    const html = `
      <p>Dear ${student.name},</p>
      <p>Your teacher <strong>${teacher.name}</strong> has assigned new homework.</p>
      <table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse;">
        <thead>
          <tr>
            <th>Sabaq</th>
            <th>Sabqi</th>
            <th>Manzil</th>
            <th>Comment</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${sabaq || "-"}</td>
            <td>${sabqi || "-"}</td>
            <td>${manzil || "-"}</td>
            <td>${comment || "-"}</td>
          </tr>
        </tbody>
      </table>
      <p>Regards,</p>
      <p>Umar Academy</p>
    `;

    await sendEmail(student.email, subject, "", html); // send to student only

    res.status(201).json({ message: "Homework submitted & notification sent ✅" });
  } catch (err) {
    console.error("Homework Error:", err);
    res.status(500).json({ message: "Something went wrong", error: err.message });
  }
};

// ✅ Get Homework for a Specific Student
exports.getStudentHomework = async (req, res) => {
  try {
    const { studentId } = req.params;
    const homework = await Homework.find({ student: studentId }).populate("teacher", "name");
    res.status(200).json(homework);
  } catch (error) {
    console.error("Error fetching student homework:", error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ Update Homework
exports.updateHomework = async (req, res) => {
  try {
    const { sabaq, sabqi, manzil, comment } = req.body;

    const updatedHomework = await Homework.findByIdAndUpdate(
      req.params.id,
      { sabaq, sabqi, manzil, comment },
      { new: true }
    );

    if (!updatedHomework) {
      return res.status(404).json({ message: "Homework not found" });
    }

    res.status(200).json({ message: "Homework updated successfully", updatedHomework });
  } catch (error) {
    console.error("Error updating homework:", error);
    res.status(500).json({ error: error.message });
  }
};

// ✅ Get All Homework (Super Admin)
exports.getAllHomework = async (req, res) => {
  try {
    const homework = await Homework.find().populate("teacher student", "name email");
    res.status(200).json(homework);
  } catch (error) {
    console.error("Error fetching homework:", error);
    res.status(500).json({ error: error.message });
  }
};
exports.getTeacherHomework = async (req, res) => {
  try {
    const homework = await Homework.find({ teacher: req.params.teacherId }).populate("student", "name");
    res.status(200).json(homework);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
