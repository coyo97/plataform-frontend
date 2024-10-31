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

  // Obtener la lista de amigos
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await axios.get(`${HOST}${SERVICE}/users/friends`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
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
  }, [HOST, SERVICE]);

  return (
    <div>
      <h1>Lista de Amigos</h1>
      <ul>
        {list.map((friend) => (
          <li key={friend._id}>{friend.username}</li>
        ))}
      </ul>
    </div>
  );
};

export default FriendsList;

