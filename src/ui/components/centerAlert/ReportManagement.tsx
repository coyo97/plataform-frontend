import React, { useState, useEffect } from 'react';
import axios from 'axios';
import getEnvVariables from '../../../config/configEnvs';

interface Report {
  _id: string;
  reporter: {
    _id: string;
    username: string;
  };
  publication: {
    _id: string;
    title: string;
    author: {
      _id: string;
      username: string;
    };
  };
  reason: string;
  status: 'pending' | 'reviewed' | 'dismissed';
  createdAt: string;
  updatedAt: string;
}

const ReportManagement: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const {HOST, SERVICE} = getEnvVariables();

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${HOST}${SERVICE}/reports`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReports(response.data.reports);
    } catch (error) {
      console.error('Error al obtener los reportes:', error);
    }
  };

  const handleUpdateStatus = async (reportId: string, status: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${HOST}${SERVICE}/reports/${reportId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchReports();
    } catch (error) {
      console.error('Error al actualizar el reporte:', error);
    }
  };

  return (
    <div>
      <h2>Gestión de Reportes</h2>
      <table>
        <thead>
          <tr>
            <th>Reportado Por</th>
            <th>Publicación</th>
            <th>Razón</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report) => (
            <tr key={report._id}>
              <td>{report.reporter.username}</td>
              <td>{report.publication.title}</td>
              <td>{report.reason}</td>
              <td>{report.status}</td>
              <td>
                {report.status === 'pending' && (
                  <>
                    <button onClick={() => handleUpdateStatus(report._id, 'reviewed')}>Marcar como Revisado</button>
                    <button onClick={() => handleUpdateStatus(report._id, 'dismissed')}>Descartar</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReportManagement;

