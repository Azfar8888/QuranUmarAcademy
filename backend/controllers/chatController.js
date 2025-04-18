const Group = require("../models/groupModel");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const multer = require("multer");
const path = require("path");

// Configure file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// ✅ CREATE GROUP (Only SuperAdmin)
exports.createGroup = async (req, res) => {
  try {
    const { groupName, members } = req.body;
    if (req.user.role !== "SuperAdmin") {
      return res.status(403).json({ message: "Only SuperAdmin can create groups" });
    }

    if (!groupName || !members || members.length === 0) {
      return res.status(400).json({ message: "Group name and members are required" });
    }

    const group = await Group.create({
      groupName,
      createdBy: req.user.id,
      members,
    });

    res.status(201).json({ message: "Group created successfully", group });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ FETCH GROUPS
exports.getGroups = async (req, res) => {
  try {
    const groups = await Group.find({ members: req.user.id }).populate("members", "name email");
    res.status(200).json(groups);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ SEND MESSAGE (Text, Images, Audio)
exports.sendMessage = async (req, res) => {
  try {
    const { groupId, messageType, content } = req.body;
    if (!groupId || !content) {
      return res.status(400).json({ message: "Group ID and message content are required" });
    }

    let fileUrl = "";
    if (req.file) {
      fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    }

    const message = await Message.create({
      groupId,
      sender: req.user.id,
      messageType,
      content: fileUrl || content,
    });

    req.io.to(groupId).emit("newMessage", message);
    res.status(201).json({ message: "Message sent", data: message });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ FETCH MESSAGES FOR A GROUP
exports.getMessages = async (req, res) => {
  try {
    const { groupId } = req.params;
    const messages = await Message.find({ groupId }).populate("sender", "name email");
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
