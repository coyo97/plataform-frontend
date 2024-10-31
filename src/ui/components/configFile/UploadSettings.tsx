// src/components/admin/UploadSettings.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import getEnvVariables from '../../../config/configEnvs';

const UploadSettings: React.FC = () => {
  const [maxUploadSize, setMaxUploadSize] = useState<number>(50 * 1024 * 1024); // 50MB por defecto
  const {HOST, SERVICE} = getEnvVariables();


  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${HOST}${SERVICE}/settings`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMaxUploadSize(response.data.settings.maxUploadSize);
      } catch (error) {
        console.error('Error al obtener las configuraciones:', error);
      }
    };

    fetchSettings();
  }, []);

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${HOST}${SERVICE}/settings`,
        { maxUploadSize },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Configuración actualizada');
    } catch (error) {
      console.error('Error al actualizar las configuraciones:', error);
    }
  };

  return (
    <div>
      <h2>Configuración de Subida de Archivos</h2>
      <label>
        Tamaño máximo de subida (en MB):
        <input
          type="number"
          value={maxUploadSize / (1024 * 1024)}
          onChange={(e) => setMaxUploadSize(Number(e.target.value) * 1024 * 1024)}
        />
      </label>
      <button onClick={handleUpdate}>Actualizar</button>
    </div>
  );
};

export default UploadSettings;

