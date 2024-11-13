import React, { useState, useEffect } from 'react';
import axios from 'axios';
import getEnvVariables from '../../../config/configEnvs';
import {
	Container,
	Title,
	Table,
	TableHeader,
	TableRow,
	TableCell,
	Button,
} from './reportManagementStyles';
import { Typography } from '@mui/material';

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
	} | null; // Cambiar a opcional para manejar publicaciones eliminadas
	reason: string;
	status: 'pending' | 'reviewed' | 'dismissed';
	createdAt: string;
	updatedAt: string;
}

const ReportManagement: React.FC = () => {
	const [reports, setReports] = useState<Report[]>([]);
	const { HOST, SERVICE } = getEnvVariables();

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
		<Container>
			<Title>Gestión de Reportes</Title>
			<Table>
				<thead>
					<tr>
						<TableHeader>Reportado Por</TableHeader>
						<TableHeader>Publicación</TableHeader>
						<TableHeader>Razón</TableHeader>
						<TableHeader>Estado</TableHeader>
						<TableHeader>Acciones</TableHeader>
					</tr>
				</thead>
				<tbody>
					{reports.map((report) => (
						<TableRow key={report._id}>
							<TableCell>{report.reporter.username}</TableCell>
							<TableCell>
								{/* Verificación de la publicación y su título */}
								{report.publication ? (
									report.publication.title
								) : (
									<Typography color="textSecondary">Publicación eliminada</Typography>
								)}
							</TableCell>
							<TableCell>{report.reason}</TableCell>
							<TableCell>{report.status}</TableCell>
							<TableCell>
								{report.status === 'pending' && (
									<>
										<Button
											variant="primary"
											onClick={() => handleUpdateStatus(report._id, 'reviewed')}
										>
											Marcar como Revisado
										</Button>
										<Button
											variant="secondary"
											onClick={() => handleUpdateStatus(report._id, 'dismissed')}
										>
											Descartar
										</Button>
									</>
								)}
							</TableCell>
						</TableRow>
					))}
				</tbody>
			</Table>
		</Container>
	);
};

export default ReportManagement;

