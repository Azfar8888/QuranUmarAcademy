const Message = require("../models/messageModel");
const User = require("../models/userModel");

// Send Message (Teachers and Admins)
exports.sendMessage = async (req, res) => {
  try {
    const { recipients, subject, content } = req.body;

    if (!recipients || recipients.length === 0) {
      return res.status(400).json({ message: "At least one recipient is required" });
    }

    const message = await Message.create({
      sender: req.user.id,
      recipients,
      subject,
      content
    });

    res.status(201).json({ message: "Message sent successfully", message });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Inbox for User
exports.getInbox = async (req, res) => {
  try {
    const inbox = await Message.find({ recipients: req.user.id })
      .populate("sender", "name email")
      .sort({ dateSent: -1 });

    res.status(200).json(inbox);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mark Message as Read
exports.markAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    if (!message.recipients.includes(req.user.id)) {
      return res.status(403).json({ message: "You are not a recipient of this message" });
    }

    if (!message.readBy.includes(req.user.id)) {
      message.readBy.push(req.user.id);
      await message.save();
    }

    res.status(200).json({ message: "Message marked as read", message });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
