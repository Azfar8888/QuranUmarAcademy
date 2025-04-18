// // const mongoose = require("mongoose");

// // const AttendanceSchema = new mongoose.Schema({
// //   student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
// //   teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
// //   date: { type: Date, default: Date.now },
// //   status: { type: String, enum: ["Present", "Absent", "Late", "Excused"], required: true }
// // });

// // module.exports = mongoose.model("Attendance", AttendanceSchema);

// const mongoose = require("mongoose");

// const attendanceSchema = new mongoose.Schema({
//   student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
//   teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
//   status: { type: String, enum: ["Present", "Absent", "Late", "Excused"], required: true },
//   date: { type: Date, default: Date.now },
// });

// // Ensure that at least one of student or teacher is provided
// attendanceSchema.pre("validate", function (next) {
//   if (!this.student && !this.teacher) {
//     next(new Error("Either student or teacher must be assigned to attendance."));
//   } else {
//     next();
//   }
// });

// module.exports = mongoose.model("Attendance", attendanceSchema);




const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
  status: { type: String, enum: ["Present", "Absent", "Late", "Excused"], required: true },
  date: { type: Date, default: Date.now },
  arrivalTime: {
    type: String, // or Date if using full date-time
    default: null
  },
  late: {
    type: Boolean,
    default: false
  },
  lateByMinutes: {
    type: Number,
    default: 0
  }
  
});

attendanceSchema.pre("validate", function (next) {
  if (!this.student && !this.teacher) {
    next(new Error("Either student or teacher must be assigned to attendance."));
  } else {
    next();
  }
});

module.exports = mongoose.model("Attendance", attendanceSchema);
