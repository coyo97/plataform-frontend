// src/components/admin/CommentModerationSettings.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import getEnvVariables from '../../../config/configEnvs';

const CommentModerationSettings: React.FC = () => {
  const [commentModerationEnabled, setCommentModerationEnabled] = useState<boolean>(true);
  const {HOST, SERVICE} = getEnvVariables();

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${HOST}${SERVICE}/comment-moderation-status`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCommentModerationEnabled(response.data.commentModerationEnabled);
      } catch (error) {
        console.error('Error al obtener el estado del moderador de comentarios:', error);
      }
    };

    fetchStatus();
  }, []);

  const toggleModeration = async () => {
    try {
      const token = localStorage.getItem('token');
      const newStatus = !commentModerationEnabled;
      await axios.put(
        `${HOST}${SERVICE}/comment-moderation-status`,
        { commentModerationEnabled: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCommentModerationEnabled(newStatus);
      alert(`Moderador de comentarios ${newStatus ? 'activado' : 'desactivado'}`);
    } catch (error) {
      console.error('Error al actualizar el estado del moderador de comentarios:', error);
    }
  };

  return (
    <div>
      <h2>Configuración del Moderador de Comentarios</h2>
      <p>El moderador de comentarios está actualmente: {commentModerationEnabled ? 'Activado' : 'Desactivado'}</p>
      <button onClick={toggleModeration}>
        {commentModerationEnabled ? 'Desactivar' : 'Activar'} Moderador de Comentarios
      </button>
    </div>
  );
};

export default CommentModerationSettings;

