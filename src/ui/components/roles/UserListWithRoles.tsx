import React, { useState, useEffect } from 'react';
import axios from 'axios';
import getEnvVariables from '../../../config/configEnvs';

interface Role {
  _id: string;
  name: string;
}

interface User {
  _id: string;
  username: string;
  email: string;
  roles: Role[];
}

const UserListWithRoles: React.FC = () => {
  const [list, setUsers] = useState<User[]>([]);
  const { HOST, SERVICE } = getEnvVariables();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No se encontró el token. Por favor, inicia sesión.');
      return;
    }

    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${HOST}${SERVICE}/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data && response.data.list) {
          setUsers(response.data.list);
        } else {
          console.error('La respuesta no contiene la lista de usuarios esperada.');
        }
      } catch (error) {
        console.error('Error al obtener usuarios:', error);
        alert('Error al obtener usuarios');
      }
    };

    fetchUsers();
  }, [HOST, SERVICE]);

  return (
    <div>
      <h2>Lista de Usuarios con sus Roles</h2>
      <table>
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Email</th>
            <th>Roles</th>
          </tr>
        </thead>
        <tbody>
          {list.map(user => (
            <tr key={user._id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>
                {user.roles && user.roles.length > 0 ? (
                  user.roles.map(role => role.name).join(', ')
                ) : (
                  'Sin roles asignados'
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserListWithRoles;

