import React, { useState } from 'react';
import axios from 'axios';
import getEnvVariables from '../../../config/configEnvs';

interface User {
  _id: string;
  username: string;
  email: string;
  status: 'none' | 'friend' | 'request_sent' | 'request_received';
}


const UserSearch: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [results, setResults] = useState<User[]>([]);
  const [message, setMessage] = useState<string>('');
  const { HOST, SERVICE } = getEnvVariables();

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.get(`${HOST}${SERVICE}/users/search`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        params: { q: searchQuery },
      });
      if (response.data && response.data.users) {
        setResults(response.data.users);
      } else {
        console.error('La respuesta no contiene los usuarios esperados.');
      }
    } catch (error) {
      console.error('Error al buscar usuarios:', error);
    }
  };

  const handleSendFriendRequest = async (id: string) => {
    try {
      await axios.post(
        `${HOST}${SERVICE}/users/${id}/send-friend-request`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      setMessage('Solicitud de amistad enviada');
      // Opcional: actualizar el estado para indicar que la solicitud fue enviada
    } catch (error) {
      console.error('Error al enviar la solicitud de amistad:', error);
      setMessage('Error al enviar la solicitud de amistad');
    }
  };

  return (
    <div>
      <h1>Buscar Usuarios</h1>
      {message && <p>{message}</p>}
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Buscar por nombre de usuario o email"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          required
        />
        <button type="submit">Buscar</button>
      </form>
		<ul>
  {results.map((user) => (
    <li key={user._id}>
      {user.username} ({user.email})
      {user.status === 'none' && (
        <button onClick={() => handleSendFriendRequest(user._id)}>Enviar Solicitud de Amistad</button>
      )}
      {user.status === 'friend' && <span>Ya son amigos</span>}
      {user.status === 'request_sent' && <span>Solicitud enviada</span>}
      {user.status === 'request_received' && <span>Te ha enviado una solicitud</span>}
    </li>
  ))}
</ul>

    </div>
  );
};

export default UserSearch;

