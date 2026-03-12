import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../lib/api';

// Custom interface to avoid conflict with browser's Notification API
export interface CustomNotification {
  _id: string;
  title: string;
  message: string;
  type: 'certificate_approved' | 'appointment_reminder' | 'system' | 'info' | 'warning' | 'success';
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
  metadata?: any;
}

interface NotificationContextType {
  notifications: CustomNotification[];
  unreadCount: number;
  loading: boolean;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<CustomNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      console.log('🔔 Fetching notifications...');
      const response = await api.get('/api/notifications');
      console.log('🔔 Notifications response:', response.data);
      setNotifications((response.data.notifications || []) as CustomNotification[]);
      setUnreadCount(response.data.unreadCount || 0);
      console.log('🔔 Notifications loaded:', response.data.notifications?.length || 0);
    } catch (error) {
      console.error('❌ Failed to fetch notifications:', error);
      // Try to fetch without authentication for debugging
      try {
        const testResponse = await fetch('http://localhost:5000/api/test-api');
        const testData = await testResponse.json();
        console.log('🔔 Test API data:', testData);
      } catch (testError) {
        console.error('❌ Test API also failed:', testError);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await api.get('/api/notifications/unread-count');
      setUnreadCount(response.data.unreadCount);
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await api.put(`/api/notifications/${id}/read`);
      setNotifications(prev => 
        prev.map(notif => 
          notif._id === id ? { ...notif, isRead: true } : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put('/api/notifications/mark-all-read');
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, isRead: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await api.delete(`/api/notifications/${id}`);
      setNotifications(prev => prev.filter(notif => notif._id !== id));
      const deletedNotif = notifications.find(notif => notif._id === id);
      if (deletedNotif && !deletedNotif.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        deleteNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
