import React, { useState, useEffect } from 'react';
import axios from 'axios';
import getEnvVariables from '../../../config/configEnvs';

interface User {
  _id: string;
  username: string;
  email: string;
}

const FriendsList: React.FC = () => {
  const [list, setList] = useState<User[]>([]);
  const { HOST, SERVICE } = getEnvVariables();
  const token = localStorage.getItem('token');

  // Obtener la lista de amigos
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await axios.get(`${HOST}${SERVICE}/users/friends`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data && response.data.friends) {
          setList(response.data.friends);
        } else {
          console.error('La respuesta no contiene la lista de amigos esperada.');
        }
      } catch (error) {
        console.error('Error al obtener la lista de amigos:', error);
      }
    };
    fetchFriends();
  }, [HOST, SERVICE, token]);

  const removeFriend = async (friendId: string) => {
    try {
      await axios.delete(`${HOST}${SERVICE}/users/${friendId}/remove-friend`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Remover amigo de la lista
      setList((prevList) => prevList.filter((friend) => friend._id !== friendId));
      alert('Amigo eliminado');
    } catch (error) {
      console.error('Error al eliminar al amigo:', error);
      alert('Error al eliminar al amigo');
    }
  };

  const blockUser = async (userId: string) => {
    try {
      await axios.post(`${HOST}${SERVICE}/users/${userId}/block`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Remover usuario de la lista de amigos
      setList((prevList) => prevList.filter((friend) => friend._id !== userId));
      alert('Usuario bloqueado');
    } catch (error) {
      console.error('Error al bloquear al usuario:', error);
      alert('Error al bloquear al usuario');
    }
  };

  return (
    <div>
      <h1>Lista de Amigos</h1>
      <ul>
        {list.map((friend) => (
          <li key={friend._id}>
            {friend.username}
            <button onClick={() => removeFriend(friend._id)}>Eliminar amigo</button>
            <button onClick={() => blockUser(friend._id)}>Bloquear usuario</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FriendsList;

