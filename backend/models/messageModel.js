const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group", required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  messageType: { type: String, enum: ["text", "audio", "image", "emoji"], required: true },
  content: { type: String, required: true }, // Text message, emoji, or file URL
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Message", messageSchema);
