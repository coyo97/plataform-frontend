import React, { useState, useEffect } from 'react';
import axios from 'axios';
import getEnvVariables from '../../../config/configEnvs';

interface User {
  _id: string;
  username: string;
  email: string;
}

const BlockedUsersList: React.FC = () => {
  const [blockedUsers, setBlockedUsers] = useState<User[]>([]);
  const { HOST, SERVICE } = getEnvVariables();
  const token = localStorage.getItem('token');

  // Obtener la lista de usuarios bloqueados
  useEffect(() => {
    const fetchBlockedUsers = async () => {
      try {
        const response = await axios.get(`${HOST}${SERVICE}/users/blocked-users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data && response.data.blockedUsers) {
          setBlockedUsers(response.data.blockedUsers);
        } else {
          console.error('La respuesta no contiene la lista de usuarios bloqueados esperada.');
        }
      } catch (error) {
        console.error('Error al obtener la lista de usuarios bloqueados:', error);
      }
    };
    fetchBlockedUsers();
  }, [HOST, SERVICE, token]);

  const unblockUser = async (userId: string) => {
    try {
      await axios.post(`${HOST}${SERVICE}/users/${userId}/unblock`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Remover usuario de la lista de bloqueados
      setBlockedUsers((prevList) => prevList.filter((user) => user._id !== userId));
      alert('Usuario desbloqueado');
    } catch (error) {
      console.error('Error al desbloquear al usuario:', error);
      alert('Error al desbloquear al usuario');
    }
  };

  return (
    <div>
      <h1>Usuarios Bloqueados</h1>
      <ul>
        {blockedUsers.map((user) => (
          <li key={user._id}>
            {user.username}
            <button onClick={() => unblockUser(user._id)}>Desbloquear usuario</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BlockedUsersList;

