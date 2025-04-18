// const mongoose = require("mongoose");

// const HomeworkSchema = new mongoose.Schema({
//   teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }], // ✅ Ensure it's an array
//   title: { type: String, required: true },
//   description: { type: String, required: true },
//   dueDate: { type: Date, required: true },
// }, { timestamps: true });

// module.exports = mongoose.model("Homework", HomeworkSchema);
// const mongoose = require("mongoose");

// const HomeworkSchema = new mongoose.Schema({
//   teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }],
//   assignments: [
//     {
//       day: { type: String, required: true },
//       content: { type: String, default: "" }, // ✅ Store text for each day
//     },
//   ],
// }, { timestamps: true });

// module.exports = mongoose.model("Homework", HomeworkSchema);
// const mongoose = require("mongoose");

// const HomeworkSchema = new mongoose.Schema({
//   teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   date: { type: Date, required: true },
//   content: { type: String, required: true },
// });

// const Homework = mongoose.model("Homework", HomeworkSchema);
// module.exports = Homework;

const mongoose = require("mongoose");

const HomeworkSchema = new mongoose.Schema({
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, required: true },
  sabaq: { type: String, default: "" },
  sabqi: { type: String, default: "" },
  manzil: { type: String, default: "" },
  comment: { type: String, default: "" },
});

const Homework = mongoose.model("Homework", HomeworkSchema);
module.exports = Homework;



