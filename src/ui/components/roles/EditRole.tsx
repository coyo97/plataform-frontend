import React, { useState, useEffect } from 'react';
import axios from 'axios';
import getEnvVariables from '../../../config/configEnvs';

interface Role {
  _id: string;
  name: string;
  description?: string;
}

interface EditRoleProps {
  roleId: string;
}

const EditRole: React.FC<EditRoleProps> = ({ roleId }) => {
  const [role, setRole] = useState<Role | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const { HOST, SERVICE } = getEnvVariables();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No se encontró el token. Por favor, inicia sesión.');
      return;
    }

    const fetchRole = async () => {
      try {
        const response = await axios.get(`${HOST}${SERVICE}/roles/${roleId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data && response.data.role) {
          setRole(response.data.role);
          setName(response.data.role.name);
          setDescription(response.data.role.description || '');
        } else {
          console.error('La respuesta no contiene el rol esperado.');
        }
      } catch (error) {
        console.error('Error al obtener el rol:', error);
        alert('Error al obtener el rol');
      }
    };

    fetchRole();
  }, [HOST, SERVICE, roleId]);

  const handleEditRole = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No se encontró el token. Por favor, inicia sesión.');
      return;
    }

    try {
      await axios.put(
        `${HOST}${SERVICE}/roles/${roleId}`,
        { name, description, permissions: [] }, // Ajusta los permisos según tus necesidades
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert('Rol actualizado exitosamente');
      // Opcional: Redirigir o actualizar la lista de roles
    } catch (error) {
      console.error('Error al actualizar rol:', error);
      alert('Error al actualizar rol');
    }
  };

  if (!role) return <div>Cargando...</div>;

  return (
    <div>
      <h2>Editar Rol</h2>
      <div>
        <label>Nombre del Rol:</label>
        <input type="text" value={name} onChange={e => setName(e.target.value)} />
      </div>
      <div>
        <label>Descripción:</label>
        <input type="text" value={description} onChange={e => setDescription(e.target.value)} />
      </div>
      {/* Agregar campos para permisos si es necesario */}
      <button onClick={handleEditRole}>Guardar Cambios</button>
    </div>
  );
};

export default EditRole;

