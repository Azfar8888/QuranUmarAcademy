const Settings = require("../models/settingsModel");

// Get System Settings (Only SuperAdmin)
exports.getSettings = async (req, res) => {
  try {
    const settings = await Settings.findOne();
    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update System Settings (Only SuperAdmin)
exports.updateSettings = async (req, res) => {
  try {
    if (req.user.role !== "SuperAdmin") {
      return res.status(403).json({ message: "Only SuperAdmin can update system settings" });
    }

    const { academicYear, attendanceRules, permissions } = req.body;

    const updatedSettings = await Settings.findOneAndUpdate({}, { academicYear, attendanceRules, permissions }, { new: true, upsert: true });

    res.status(200).json({ message: "System settings updated successfully", settings: updatedSettings });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
