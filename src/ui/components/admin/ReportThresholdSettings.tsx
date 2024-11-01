// src/ui/components/admin/ReportThresholdSettings.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import getEnvVariables from '../../../config/configEnvs';

const ReportThresholdSettings: React.FC = () => {
  const [reportThreshold, setReportThreshold] = useState<number>(5);
  const [notificationThreshold, setNotificationThreshold] = useState<number>(3);
  const { HOST, SERVICE } = getEnvVariables();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${HOST}${SERVICE}/settings`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReportThreshold(response.data.settings.reportThreshold);
        setNotificationThreshold(response.data.settings.notificationThreshold);
      } catch (error) {
        console.error('Error al obtener los umbrales de reporte:', error);
      }
    };

    fetchSettings();
  }, [HOST, SERVICE]);

  const updateThresholds = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${HOST}${SERVICE}/settings`,
        { reportThreshold, notificationThreshold },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Umbrales actualizados correctamente');
    } catch (error) {
      console.error('Error al actualizar los umbrales de reporte:', error);
    }
  };

  return (
    <div>
      <h2>Configuración de Umbrales de Reporte</h2>
      <div>
        <label>
          Umbral para bloquear usuarios:
          <input
            type="number"
            value={reportThreshold}
            onChange={(e) => setReportThreshold(Number(e.target.value))}
          />
        </label>
      </div>
      <div>
        <label>
          Umbral para notificaciones:
          <input
            type="number"
            value={notificationThreshold}
            onChange={(e) => setNotificationThreshold(Number(e.target.value))}
          />
        </label>
      </div>
      <button onClick={updateThresholds}>Guardar Cambios</button>
    </div>
  );
};

export default ReportThresholdSettings;

