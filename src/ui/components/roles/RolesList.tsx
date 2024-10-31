import React, { useState, useEffect } from 'react';
import axios from 'axios';
import getEnvVariables from '../../../config/configEnvs';


interface Role {
  _id: string;
  name: string;
  description?: string;
  permissions: {
    module: string;
    action: string;
  }[];
}

const RolesList: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const { HOST, SERVICE } = getEnvVariables();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No se encontró el token. Por favor, inicia sesión.');
      return;
    }

    const fetchRoles = async () => {
      try {
        const response = await axios.get(`${HOST}${SERVICE}/roles`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRoles(response.data.roles);
      } catch (error) {
        console.error('Error al obtener roles:', error);
        alert('Error al obtener roles');
      }
    };

    fetchRoles();
  }, [HOST, SERVICE]);


  const handleDeleteRole = async (roleId: string) => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('No se encontró el token. Por favor, inicia sesión.');
    return;
  }

  try {
    await axios.delete(`${HOST}${SERVICE}/roles/${roleId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    alert('Rol eliminado exitosamente');
    // Actualizar la lista de roles
    setRoles(prevRoles => prevRoles.filter(role => role._id !== roleId));
  } catch (error) {
    console.error('Error al eliminar rol:', error);
    alert('Error al eliminar rol');
  }
};


  return (
    <div>
      <h2>Lista de Roles</h2>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Permisos</th>
          </tr>
        </thead>
        <tbody>
          {roles.map(role => (
            <tr key={role._id}>
              <td>{role.name}</td>
              <td>{role.description}</td>
              <td>
                <ul>
                  {role.permissions.map((perm, index) => (
                    <li key={index}>{perm.module} - {perm.action}</li>
                  ))}
                </ul>
				  <button onClick={() => handleDeleteRole(role._id)}>Eliminar</button>

              </td>
              {/* Puedes agregar botones para editar o eliminar roles aquí */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RolesList;

