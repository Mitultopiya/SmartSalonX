import Notification from '../models/Notification.model.js';
import Barber from '../models/Barber.model.js';

export const debugNotifications = async (req, res) => {
  try {
    console.log('🔍 Debugging notifications...');
    
    // Get all notifications
    const allNotifications = await Notification.find({})
      .populate('userId', 'name email role')
      .sort({ createdAt: -1 });
    
    // Get all barbers
    const allBarbers = await Barber.find({})
      .populate('userId', 'name email role')
      .populate('salonId', 'name');
    
    // Get notifications for each barber
    const barberNotifications = await Notification.find({
      userId: { $in: allBarbers.map(b => b.userId._id) }
    }).populate('userId', 'name email role');

    res.json({
      totalNotifications: allNotifications.length,
      allNotifications: allNotifications.map(n => ({
        id: n._id,
        userId: n.userId?.email || 'Unknown',
        userName: n.userId?.name || 'Unknown',
        userRole: n.userId?.role || 'Unknown',
        title: n.title,
        message: n.message,
        type: n.type,
        isRead: n.isRead,
        createdAt: n.createdAt
      })),
      totalBarbers: allBarbers.length,
      barbers: allBarbers.map(b => ({
        id: b._id,
        userId: b.userId._id,
        userEmail: b.userId.email,
        userName: b.userId.name,
        status: b.status,
        salonName: b.salonId?.name || 'No salon'
      })),
      barberNotifications: barberNotifications.length,
      barberNotificationDetails: barberNotifications.map(n => ({
        id: n._id,
        userId: n.userId._id,
        userEmail: n.userId.email,
        title: n.title,
        message: n.message,
        type: n.type,
        isRead: n.isRead,
        createdAt: n.createdAt
      }))
    });
  } catch (error) {
    console.error('❌ Debug notifications error:', error);
    res.status(500).json({ 
      message: 'Debug error', 
      error: error.message 
    });
  }
};
