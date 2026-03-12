import Notification from '../models/Notification.model.js';

export const createNotification = async (userId, title, message, type = 'info', options = {}) => {
  try {
    const notification = await Notification.create({
      userId,
      title,
      message,
      type,
      ...options,
    });
    
    console.log('✅ Notification created:', {
      id: notification._id,
      userId,
      title,
      type,
    });
    
    return notification;
  } catch (error) {
    console.error('❌ Failed to create notification:', error);
    throw error;
  }
};

export const getUserNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 20, unreadOnly = false } = req.query;
    const userId = req.user._id;

    const query = { userId };
    if (unreadOnly === 'true') {
      query.isRead = false;
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('relatedId', 'name');

    const total = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({ userId, isRead: false });

    res.json({
      notifications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
      unreadCount,
    });
  } catch (error) {
    console.error('Get Notifications Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const notification = await Notification.findOneAndUpdate(
      { _id: id, userId },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json({ message: 'Notification marked as read', notification });
  } catch (error) {
    console.error('Mark Notification Read Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const markAllNotificationsAsRead = async (req, res) => {
  try {
    const userId = req.user._id;

    await Notification.updateMany(
      { userId, isRead: false },
      { isRead: true }
    );

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Mark All Notifications Read Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const notification = await Notification.findOneAndDelete({ _id: id, userId });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Delete Notification Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getUnreadCount = async (req, res) => {
  try {
    const userId = req.user._id;
    const count = await Notification.countDocuments({ userId, isRead: false });

    res.json({ unreadCount: count });
  } catch (error) {
    console.error('Get Unread Count Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
