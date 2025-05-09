// const mongoose = require("mongoose");

// const groupSchema = new mongoose.Schema({
//   groupName: { type: String, required: true },
//   createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
//   createdAt: { type: Date, default: Date.now }
// });

// module.exports = mongoose.model("Group", groupSchema);

// groupModel.js
const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
  groupName: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
}, { timestamps: true });

module.exports = mongoose.model("Group", groupSchema);

