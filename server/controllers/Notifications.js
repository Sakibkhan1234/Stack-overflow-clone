import Notification from "../models/Notification.js";

export const sendNotification = async (req, res) => {
  const { recipientId, senderId, senderName, message, questionId, questionTitle } = req.body;
  console.log("Notification details received:", { recipientId, senderId, senderName, message, questionId, questionTitle });

  const newNotification = new Notification({
    recipientId,
    senderId,
    senderName,
    message,
    questionId,
    questionTitle,
  });

  try {
    await newNotification.save();
    console.log("Notification saved successfully");
    res.status(200).json(newNotification);
  } catch (error) {
    console.log("Error saving notification:", error);
    res.status(409).json({ message: error.message });
  }
};


export const getNotifications = async (req, res) => {
  const { userId } = req.params;

  try {
    const notifications = await Notification.find({ recipientId: userId }).sort({ createdAt: -1 });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const markAsRead = async (req, res) => {
  const { id } = req.params;

  try {
    const notification = await Notification.findById(id);
    if (notification) {
      notification.isRead = true;
      await notification.save();
      res.status(200).json(notification);
    } else {
      res.status(404).json({ message: "Notification not found" });
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const deleteNotification = async (req, res) => {
  const { id } = req.params;

  try {
    await Notification.findByIdAndDelete(id);
    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};


