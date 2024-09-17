// src/ui/components/notifications/Notifications.tsx
import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import getEnvVariables from '../../../config/configEnvs';

interface Notification {
    message: string;
    type: string;
    data: any; // Puede ser más específico dependiendo del tipo de notificación
}

const Notifications: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const { HOST } = getEnvVariables();
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            console.error('No se encontró el token en el localStorage');
            return;
        }

        const socket = io(`${HOST}`, {
            auth: { token },
        });

        socket.on('new-notification', (notification: Notification) => {
            setNotifications((prev) => [...prev, notification]);
        });

        return () => {
            socket.close();
        };
    }, [HOST, token]);

    return (
        <div>
            <h3>Notificaciones</h3>
            {notifications.map((notification, index) => (
                <div key={index}>
                    <p>{notification.message}</p>
                </div>
            ))}
        </div>
    );
};

export default Notifications;

