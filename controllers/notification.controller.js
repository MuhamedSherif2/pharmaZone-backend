import Notification from "../models/notification.model.js";

// create  New notification   
export const createNotification = async (req, res) => {
  try {
    const { user, pharmacy, title, message, type } = req.body;

    if (!title || !message) {
      return res.status(400).json({
        success: false,
        message: "Title and message are required"
      });
    }

    const notification = new Notification({
      user,
      pharmacy,
      title,
      message,
      type
    });

    await notification.save();
    res.status(201).json({ success: true, data: notification });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// getNotifications (User-Pharmacy) 
export const getNotifications = async (req, res) => {
  try {
    const { userId, pharmacyId } = req.query;

    const filter = {};
    if (userId) filter.user = userId;
    if (pharmacyId) filter.pharmacy = pharmacyId;

    const notifications = await Notification.find(filter).sort({ createdAt: -1 });

    res.json({ success: true, data: notifications });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// markAsRead notifications
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true }
    );

    res.json({ success: true, data: notification });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
