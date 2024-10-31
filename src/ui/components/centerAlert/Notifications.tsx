import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { io, Socket } from 'socket.io-client';
import getEnvVariables from '../../../config/configEnvs';

interface Notification {
  _id: string;
  recipient: string;
  sender: string;
  type: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { HOST, SERVICE } = getEnvVariables();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`${HOST}${SERVICE}/notifications`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotifications(response.data.notifications || []);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, [HOST, SERVICE, token]);

  // Configurar Socket.IO para recibir notificaciones en tiempo real
  useEffect(() => {
    if (!token) return;

    const socket: Socket = io(HOST, {
      auth: {
        token,
      },
    });

    socket.on('new-notification', (notification: Notification) => {
      setNotifications((prev) => [notification, ...prev]);
    });

    return () => {
      socket.off('new-notification');
      socket.close();
    };
  }, [HOST, token]);

  const markAsRead = async (notificationId: string) => {
    try {
      await axios.put(
        `${HOST}${SERVICE}/notifications/${notificationId}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNotifications((prev) =>
        prev.map((notif) =>
          notif._id === notificationId ? { ...notif, isRead: true } : notif
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  return (
    <div>
      <h3>Notificaciones</h3>
      <ul>
        {notifications.map((notification) => (
          <li
            key={notification._id}
            style={{ fontWeight: notification.isRead ? 'normal' : 'bold' }}
          >
            {notification.message}{' '}
            <button onClick={() => markAsRead(notification._id)}>Marcar como leída</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;

