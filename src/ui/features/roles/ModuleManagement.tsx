// ModuleManagement.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import getEnvVariables from '../../../config/configEnvs';
import {
	ModuleManagementContainer,
	SectionTitle,
	ModuleList,
	ModuleItem,
	ActionButton,
	InputContainer,
} from './moduleManagement.styles';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import { Box, TextField, Typography, Button, Grid } from '@mui/material';

interface Module {
	_id: string;
	name: string;
}

const ModuleManagement: React.FC = () => {
	const [modules, setModules] = useState<Module[]>([]);
	const [newModuleName, setNewModuleName] = useState('');
	const [editingModule, setEditingModule] = useState<Module | null>(null);
	const [editingModuleName, setEditingModuleName] = useState('');
	const { HOST, SERVICE } = getEnvVariables();
	const token = localStorage.getItem('token');
	const theme = useTheme();
	const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

	useEffect(() => {
		if (!token) {
			console.error('No se encontró el token. Por favor, inicia sesión.');
			return;
		}

		const fetchModules = async () => {
			try {
				const response = await axios.get(`${HOST}${SERVICE}/modules`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				if (response.data && response.data.modules) {
					setModules(response.data.modules);
				} else {
					console.error('La respuesta no contiene los módulos esperados.');
				}
			} catch (error) {
				console.error('Error al obtener módulos:', error);
			}
		};

		fetchModules();
	}, [HOST, SERVICE, token]);

	const handleCreateModule = async () => {
		if (!newModuleName.trim()) {
			alert('El nombre del módulo no puede estar vacío.');
			return;
		}

		try {
			const response = await axios.post(
				`${HOST}${SERVICE}/modules`,
				{ name: newModuleName },
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			setModules([...modules, response.data.module]);
			setNewModuleName('');
		} catch (error) {
			console.error('Error al crear módulo:', error);
			alert('Error al crear módulo');
		}
	};

	const startEditingModule = (module: Module) => {
		setEditingModule(module);
		setEditingModuleName(module.name);
	};

	const cancelEditing = () => {
		setEditingModule(null);
		setEditingModuleName('');
	};

	const handleUpdateModule = async () => {
		if (!editingModule || !editingModuleName.trim()) {
			alert('El nombre del módulo no puede estar vacío.');
			return;
		}

		try {
			const response = await axios.put(
				`${HOST}${SERVICE}/modules/${editingModule._id}`,
				{ name: editingModuleName },
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			setModules(
				modules.map((module) =>
							module._id === editingModule._id ? response.data.module : module
						   )
			);
			cancelEditing();
		} catch (error) {
			console.error('Error al actualizar módulo:', error);
			alert('Error al actualizar módulo');
		}
	};

	const handleDeleteModule = async (id: string) => {
		if (!window.confirm('¿Estás seguro de que deseas eliminar este módulo?')) {
			return;
		}

		try {
			await axios.delete(`${HOST}${SERVICE}/modules/${id}`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			setModules(modules.filter((module) => module._id !== id));
		} catch (error) {
			console.error('Error al eliminar módulo:', error);
			alert('Error al eliminar módulo');
		}
	};

	return (
		<ModuleManagementContainer>
			<SectionTitle variant="h6">Gestión de Módulos</SectionTitle>

			<Typography variant="subtitle1">Crear Nuevo Módulo</Typography>
			<InputContainer>
				<TextField
					label="Nombre del Módulo"
					value={newModuleName}
					onChange={(e) => setNewModuleName(e.target.value)}
					variant="outlined"
					fullWidth
				/>
				<Button
					variant="contained"
					color="primary"
					onClick={handleCreateModule}
					fullWidth
					size={isSmallScreen ? 'small' : 'medium'}
					sx={{
						width: '100%',
						maxWidth: '200px',
						whiteSpace: 'nowrap',
						overflow: 'hidden',
						textOverflow: 'ellipsis',
					}}
				>
					Crear Módulo
				</Button>
			</InputContainer>

			<Typography variant="subtitle1">Lista de Módulos</Typography>
			<ModuleList>
				{modules.map((module) => (
					<ModuleItem key={module._id}>
						{editingModule && editingModule._id === module._id ? (
							<Grid
								container
								spacing={2}
								sx={{ marginBottom: 3 }}
								alignItems="flex-start"
							>
								<Grid item xs={12} sm={8}>
									<TextField
										label="Nombre del Módulo"
										value={editingModuleName}
										onChange={(e) => setEditingModuleName(e.target.value)}
										variant="outlined"
										fullWidth
									/>
								</Grid>
								<Grid item xs={12} sm={4}>
									<Button
										variant="contained"
										color="primary"
										onClick={handleUpdateModule}
										fullWidth
										size={isSmallScreen ? 'small' : 'medium'}
										sx={{
											height: '100%',
											whiteSpace: 'nowrap',
										}}
									>
										Guardar Cambios
									</Button>
								</Grid>
							</Grid>
						) : (
							<InputContainer>
								<Typography>{module.name}</Typography>
								<Box
									sx={{
										display: 'flex',
										flexDirection: { xs: 'column', sm: 'row' },
									gap: 1,
									}}
								>
									<ActionButton
										variant="contained"
										color="secondary"
										onClick={() => startEditingModule(module)}
										fullWidth={!(window.innerWidth >= 600)}
										size="small"
									>
										Editar
									</ActionButton>
									<ActionButton
										variant="outlined"
										color="error"
										onClick={() => handleDeleteModule(module._id)}
										fullWidth={!(window.innerWidth >= 600)}
										size="small"
									>
										Eliminar
									</ActionButton>
								</Box>
							</InputContainer>
						)}
					</ModuleItem>
				))}
			</ModuleList>
		</ModuleManagementContainer>
	);
};

export default ModuleManagement;

