import { useEffect, useState } from 'react';
import { useNotificationStore } from '@/store/useNotificationStore';
import { api } from '@/lib/api';
import { Bell, Check, Loader2, Info, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

export const NotificationsPage = () => {
  const { notifications, setNotifications, markAsRead, markAllAsRead, unreadCount } = useNotificationStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.get('/notifications');
        setNotifications(res.data.data);
      } catch (err) {
        console.error('Failed to load notifications', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNotifications();
  }, [setNotifications]);

  const handleMarkAsRead = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await api.put(`/notifications/${id}/read`);
      markAsRead(id);
    } catch (err) {
      console.error('Failed to mark as read', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      markAllAsRead();
    } catch (err) {
      console.error('Failed to mark all as read', err);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'SUCCESS': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'WARNING': return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'INFO': 
      default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] lg:min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-[#0a0a0a]">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-surface-900 border border-surface-800 flex items-center justify-center">
              <Bell className="w-6 h-6 text-primary-500" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-surface-50">Notifications</h1>
              <p className="text-surface-400 text-sm">You have {unreadCount} unread messages</p>
            </div>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="flex items-center gap-2 text-sm text-primary-400 hover:text-primary-300 transition-colors bg-primary-500/10 px-4 py-2 rounded-lg"
            >
              <Check className="w-4 h-4" />
              Mark all as read
            </button>
          )}
        </div>

        <div className="space-y-3">
          {isLoading ? (
            <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-primary-500" /></div>
          ) : notifications.length === 0 ? (
            <div className="bg-surface-900 border border-surface-800 rounded-2xl p-12 text-center text-surface-400">
              <Bell className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>You're all caught up!</p>
            </div>
          ) : (
            notifications.map((notification) => {
              const Wrapper = notification.link ? Link : 'div';
              return (
                <Wrapper
                  key={notification.id}
                  to={notification.link || '#'}
                  className={`block p-4 rounded-xl border transition-all ${
                    notification.isRead 
                      ? 'bg-surface-900/50 border-surface-800/50' 
                      : 'bg-surface-800 border-surface-700 shadow-[0_0_15px_rgba(232,75,58,0.05)]'
                  }`}
                >
                  <div className="flex gap-4">
                    <div className="mt-1 shrink-0">
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <h3 className={`text-sm font-semibold mb-1 ${notification.isRead ? 'text-surface-300' : 'text-surface-50'}`}>
                          {notification.title}
                        </h3>
                        <span className="text-[10px] text-surface-500 shrink-0 whitespace-nowrap">
                          {format(new Date(notification.createdAt), 'MMM d, h:mm a')}
                        </span>
                      </div>
                      <p className={`text-sm ${notification.isRead ? 'text-surface-500' : 'text-surface-300'}`}>
                        {notification.content}
                      </p>
                      
                      <div className="mt-3 flex items-center justify-between">
                        {notification.link ? (
                          <span className="text-xs text-primary-500 flex items-center gap-1 group-hover:underline">
                            View details <ExternalLink className="w-3 h-3" />
                          </span>
                        ) : <div />}
                        
                        {!notification.isRead && (
                          <button
                            onClick={(e) => handleMarkAsRead(notification.id, e)}
                            className="text-[10px] font-medium text-surface-400 hover:text-white px-2 py-1 rounded bg-surface-700 hover:bg-surface-600 transition-colors"
                          >
                            Mark read
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </Wrapper>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
