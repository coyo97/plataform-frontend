import React, { useState, useEffect } from 'react';
import axios from 'axios';
import getEnvVariables from '../../../config/configEnvs';

interface User {
  _id: string;
  username: string;
  email: string;
}

const FriendRequests: React.FC = () => {
  const [list, setList] = useState<User[]>([]);
  const [message, setMessage] = useState<string>('');
  const { HOST, SERVICE } = getEnvVariables();

  // Obtener las solicitudes de amistad recibidas
  useEffect(() => {
    const fetchFriendRequests = async () => {
      try {
        const response = await axios.get(`${HOST}${SERVICE}/users/friend-requests`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        if (response.data && response.data.friendRequests) {
          setList(response.data.friendRequests);
        } else {
          console.error('La respuesta no contiene las solicitudes de amistad esperadas.');
        }
      } catch (error) {
        console.error('Error al obtener las solicitudes de amistad:', error);
      }
    };
    fetchFriendRequests();
  }, [HOST, SERVICE]);

  // Aceptar solicitud de amistad
  const handleAcceptRequest = async (id: string) => {
    try {
      await axios.post(
        `${HOST}${SERVICE}/users/${id}/accept-friend-request`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      setMessage('Solicitud aceptada');
      setList(list.filter((req) => req._id !== id));
    } catch (error) {
      console.error('Error al aceptar la solicitud:', error);
      setMessage('Error al aceptar la solicitud');
    }
  };

  // Rechazar solicitud de amistad
  const handleRejectRequest = async (id: string) => {
    try {
      await axios.post(
        `${HOST}${SERVICE}/users/${id}/reject-friend-request`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      setMessage('Solicitud rechazada');
      setList(list.filter((req) => req._id !== id));
    } catch (error) {
      console.error('Error al rechazar la solicitud:', error);
      setMessage('Error al rechazar la solicitud');
    }
  };

  return (
    <div>
      <h1>Solicitudes de Amistad</h1>
      {message && <p>{message}</p>}
      <ul>
        {list.map((request) => (
          <li key={request._id}>
            {request.username}
            <button onClick={() => handleAcceptRequest(request._id)}>Aceptar</button>
            <button onClick={() => handleRejectRequest(request._id)}>Rechazar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FriendRequests;

