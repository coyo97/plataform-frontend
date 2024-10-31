// src/components/admin/ModerationSettings.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import getEnvVariables from '../../../config/configEnvs';

const ModerationSettings: React.FC = () => {
  const [aiModerationEnabled, setAiModerationEnabled] = useState<boolean>(true);
  const {HOST, SERVICE} = getEnvVariables();


  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${HOST}${SERVICE}/moderation-status`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAiModerationEnabled(response.data.aiModerationEnabled);
      } catch (error) {
        console.error('Error al obtener el estado del moderador de IA:', error);
      }
    };

    fetchStatus();
  }, []);

  const toggleModeration = async () => {
    try {
      const token = localStorage.getItem('token');
      const newStatus = !aiModerationEnabled;
      await axios.put(
        `${HOST}${SERVICE}/moderation-status`,
        { aiModerationEnabled: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAiModerationEnabled(newStatus);
      alert(`Moderador de IA ${newStatus ? 'activado' : 'desactivado'}`);
    } catch (error) {
      console.error('Error al actualizar el estado del moderador de IA:', error);
    }
  };

  return (
    <div>
      <h2>Configuración del Moderador de imagenes de IA</h2>
      <p>El moderador de IA está actualmente: {aiModerationEnabled ? 'Activado' : 'Desactivado'}</p>
      <button onClick={toggleModeration}>
        {aiModerationEnabled ? 'Desactivar' : 'Activar'} Moderador de IA
      </button>
    </div>
  );
};

export default ModerationSettings;

