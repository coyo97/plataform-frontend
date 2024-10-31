// src/components/admin/FileFormatManagement.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import getEnvVariables from '../../../config/configEnvs';

interface FileFormat {
  _id: string;
  mimeType: string;
  description?: string;
  enabled: boolean;
}

const FileFormatManagement: React.FC = () => {
  const [formats, setFormats] = useState<FileFormat[]>([]);
  const {HOST, SERVICE} = getEnvVariables();


  const [newFormat, setNewFormat] = useState<{ mimeType: string; description: string }>({
    mimeType: '',
    description: '',
  });

  useEffect(() => {
    fetchFormats();
  }, []);

  const fetchFormats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${HOST}${SERVICE}/file-formats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFormats(response.data.formats);
    } catch (error) {
      console.error('Error al obtener los formatos de archivo:', error);
    }
  };

  const handleCreateFormat = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${HOST}${SERVICE}/file-formats`
        ,
        newFormat,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewFormat({ mimeType: '', description: '' });
      fetchFormats();
    } catch (error) {
      console.error('Error al crear el formato de archivo:', error);
    }
  };

  const handleToggleEnabled = async (id: string, enabled: boolean) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${HOST}${SERVICE}/file-formats/${id}`,
        { enabled: !enabled },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchFormats();
    } catch (error) {
      console.error('Error al actualizar el formato de archivo:', error);
    }
  };

  const handleDeleteFormat = async (id: string) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este formato?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `${HOST}${SERVICE}/file-formats/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchFormats();
    } catch (error) {
      console.error('Error al eliminar el formato de archivo:', error);
    }
  };

  return (
    <div>
      <h2>Gestión de Formatos de Archivo</h2>
      <div>
        <h3>Agregar Nuevo Formato</h3>
        <input
          type="text"
          placeholder="Tipo MIME"
          value={newFormat.mimeType}
          onChange={(e) => setNewFormat({ ...newFormat, mimeType: e.target.value })}
        />
        <input
          type="text"
          placeholder="Descripción"
          value={newFormat.description}
          onChange={(e) => setNewFormat({ ...newFormat, description: e.target.value })}
        />
        <button onClick={handleCreateFormat}>Agregar</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Tipo MIME</th>
            <th>Descripción</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {formats.map((format) => (
            <tr key={format._id}>
              <td>{format.mimeType}</td>
              <td>{format.description || 'Sin descripción'}</td>
              <td>{format.enabled ? 'Habilitado' : 'Deshabilitado'}</td>
              <td>
                <button onClick={() => handleToggleEnabled(format._id, format.enabled)}>
                  {format.enabled ? 'Deshabilitar' : 'Habilitar'}
                </button>
                <button onClick={() => handleDeleteFormat(format._id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FileFormatManagement;

