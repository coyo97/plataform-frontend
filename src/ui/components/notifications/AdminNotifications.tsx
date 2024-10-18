import React, { useState } from 'react';
import axios from 'axios';
import getEnvVariables from '../../../config/configEnvs';

const AdminNotifications: React.FC = () => {
  const [message, setMessage] = useState('');
  const { HOST, SERVICE } = getEnvVariables();
  const token = localStorage.getItem('token');

  const sendNotification = async () => {
    try {
      const notificationData = {
        message,
        type: 'admin', // Puedes definir diferentes tipos
        recipients: 'all',
      };

      await axios.post(`${HOST}${SERVICE}/notifications`, notificationData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage('');
      alert('Notificación enviada a todos los usuarios');
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  return (
    <div>
      <h3>Enviar Notificación a Todos los Usuarios</h3>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Mensaje de la notificación"
      />
      <button onClick={sendNotification}>Enviar</button>
    </div>
  );
};

export default AdminNotifications;

