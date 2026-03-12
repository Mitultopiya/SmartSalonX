import { useState, useEffect } from 'react';
import { Bell, X, CheckCircle } from 'lucide-react';

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
  metadata?: any;
}

const SimpleNotificationBell = () => {
  const [showNotification, setShowNotification] = useState(false);
  const [notification, setNotification] = useState<Notification | null>(null);

  // Simple fetch without complex context
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch('http://localhost:5000/api/notifications', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.notifications && data.notifications.length > 0) {
            setNotification(data.notifications[0] as Notification); // Show latest notification
          }
        }
      } catch (error) {
        console.log('Notifications not available:', error);
      }
    };

    fetchNotifications();
    // Check every 10 seconds
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  if (!notification) return null;

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setShowNotification(!showNotification)}
        className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <Bell className="w-6 h-6 text-gray-700" />
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          1
        </span>
      </button>

      {/* Simple Notification Popup */}
      {showNotification && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
              <div>
                <h4 className="font-semibold text-gray-900">{notification.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(notification.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowNotification(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleNotificationBell;