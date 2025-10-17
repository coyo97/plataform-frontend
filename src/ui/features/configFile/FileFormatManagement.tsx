// src/ui/components/config/FileFormatManagement.tsx
import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import getEnvVariables from '../../../config/configEnvs';

import {
	Container,
	Title,
	SubTitle,
	Input,
	Button,
} from './fileFormatManagementStyles';

import Text from '../../shared/atoms/typography/Text';
import TableView from '../../shared/organisms/table/TableView';
import type { ColumnDef, RowAction } from '../../shared/organisms/table/tableView.types';

interface FileFormat {
	_id: string;
	mimeType: string;
	description?: string;
	enabled: boolean;
}

const FileFormatManagement: React.FC = () => {
	const [formats, setFormats] = useState<FileFormat[]>([]);
	const [loading, setLoading] = useState<boolean>(false);

	const { HOST, SERVICE } = getEnvVariables();

	const [newFormat, setNewFormat] = useState<{ mimeType: string; description: string }>({
		mimeType: '',
		description: '',
	});

	const fetchFormats = async () => {
		try {
			setLoading(true);
			const token = localStorage.getItem('token');
			const resp = await axios.get(`${HOST}${SERVICE}/file-formats`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			setFormats(resp.data.formats ?? []);
		} catch (error) {
			console.error('Error al obtener los formatos de archivo:', error);
			setFormats([]);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchFormats();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

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

	// columnas para TableView
	const columns: ColumnDef<FileFormat>[] = useMemo(() => ([
		{
			id: 'mimeType',
			header: 'Tipo MIME',
			accessor: 'mimeType',
			minWidth: 200,
			truncate: true,
		},
		{
			id: 'description',
			header: 'Descripción',
			minWidth: 280,
			truncate: true,
			hiddenAt: ['xs'], // opcional: ahorra espacio en móvil
			renderCell: (f) => (
				<Text as="span" size="sm" colorKey="text.secondary">
					{f.description || 'Sin descripción'}
				</Text>
			),
		},
		{
			id: 'enabled',
			header: 'Estado',
			minWidth: 140,
			renderCell: (f) =>
				f.enabled ? (
					<Text as="span" size="sm" colorKey="success.main">Habilitado</Text>
			) : (
				<Text as="span" size="sm" colorKey="text.disabled">Deshabilitado</Text>
			),
		},
	]), []);

	// acciones por fila
	const rowActions: RowAction<FileFormat>[] = useMemo(() => ([
		{
			label: 'Habilitar',
			color: 'success',
			visible: (f) => !f.enabled,
			onClick: (f) => handleToggleEnabled(f._id, f.enabled),
		},
		{
			label: 'Deshabilitar',
			color: 'warning',
			visible: (f) => f.enabled,
			onClick: (f) => handleToggleEnabled(f._id, f.enabled),
		},
		{
			label: 'Eliminar',
			color: 'secondary',
			variant: 'outline',
			onClick: (f) => handleDeleteFormat(f._id),
		},
	]), []);

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

			<TableView<FileFormat>
				data={formats}
				rowKey="_id"
				columns={columns}
				rowActions={rowActions}
				loading={loading}
				emptyMessage="No hay formatos configurados."
				stickyHeader
				zebra
				hoverable
				responsiveMode="auto"  // móvil: cards; desktop: tabla
				// sin pagination → TableView no muestra footer; si quieres, puedes añadirlo más adelante
				/>
			</Container>
	);
};

export default FileFormatManagement;

