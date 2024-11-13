import React, { useState, useEffect } from 'react';
import axios from 'axios';
import getEnvVariables from '../../../config/configEnvs';
import {
	Container,
	Title,
	SubTitle,
	Input,
	Button,
	Table,
	TableHeader,
	TableRow,
	TableCell,
	ActionButton,
} from './fileFormatManagementStyles';

interface FileFormat {
	_id: string;
	mimeType: string;
	description?: string;
	enabled: boolean;
}

const FileFormatManagement: React.FC = () => {
	const [formats, setFormats] = useState<FileFormat[]>([]);
	const { HOST, SERVICE } = getEnvVariables();

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
			await axios.post(`${HOST}${SERVICE}/file-formats`, newFormat, {
				headers: { Authorization: `Bearer ${token}` },
			});
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
			await axios.delete(`${HOST}${SERVICE}/file-formats/${id}`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			fetchFormats();
		} catch (error) {
			console.error('Error al eliminar el formato de archivo:', error);
		}
	};

	return (
		<Container>
			<Title>Gestión de Formatos de Archivo</Title>
			<div>
				<SubTitle>Agregar Nuevo Formato</SubTitle>
				<Input
					type="text"
					placeholder="Tipo MIME"
					value={newFormat.mimeType}
					onChange={(e) => setNewFormat({ ...newFormat, mimeType: e.target.value })}
				/>
				<Input
					type="text"
					placeholder="Descripción"
					value={newFormat.description}
					onChange={(e) => setNewFormat({ ...newFormat, description: e.target.value })}
				/>
				<Button onClick={handleCreateFormat}>Agregar</Button>
			</div>
			<Table>
				<thead>
					<tr>
						<TableHeader>Tipo MIME</TableHeader>
						<TableHeader>Descripción</TableHeader>
						<TableHeader>Estado</TableHeader>
						<TableHeader>Acciones</TableHeader>
					</tr>
				</thead>
				<tbody>
					{formats.map((format) => (
						<TableRow key={format._id}>
							<TableCell>{format.mimeType}</TableCell>
							<TableCell>{format.description || 'Sin descripción'}</TableCell>
							<TableCell>{format.enabled ? 'Habilitado' : 'Deshabilitado'}</TableCell>
							<TableCell>
								<ActionButton onClick={() => handleToggleEnabled(format._id, format.enabled)}>
									{format.enabled ? 'Deshabilitar' : 'Habilitar'}
								</ActionButton>
								<ActionButton onClick={() => handleDeleteFormat(format._id)}>Eliminar</ActionButton>
							</TableCell>
						</TableRow>
					))}
				</tbody>
			</Table>
		</Container>
	);
};

export default FileFormatManagement;

