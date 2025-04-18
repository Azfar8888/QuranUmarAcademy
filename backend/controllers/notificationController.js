const Notification = require("../models/notificationModel");

// Create Notification
exports.createNotification = async (req, res) => {
  try {
    const { recipient, type, message } = req.body;

    const notification = await Notification.create({ recipient, type, message });
    res.status(201).json({ message: "Notification created successfully", notification });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Notifications for a User
exports.getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mark Notification as Read
exports.markNotificationAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    if (notification.recipient.toString() !== req.user.id) {
      return res.status(403).json({ message: "You can only mark your own notifications as read" });
    }

    notification.isRead = true;
    await notification.save();

    res.status(200).json({ message: "Notification marked as read", notification });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
