const mongoose = require("mongoose");

const SettingsSchema = new mongoose.Schema({
  academicYear: { type: String, required: true },
  attendanceRules: { type: String, required: true },
  permissions: {
    Admin: [{ type: String }],
    Teacher: [{ type: String }]
  }
});

module.exports = mongoose.model("Settings", SettingsSchema);
