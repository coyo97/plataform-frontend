// src/ui/components/roles/CreateRole.tsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import getEnvVariables from '../../../config/configEnvs';
import {
	RoleContainer,
	Title,
	FormField,
	PermissionList,
	PermissionItem,
	AddPermissionButton,
	SubmitButton,
} from './createRole.styles';
import {
	Button,
	Typography,
	MenuItem,
	Select,
	FormControl,
	InputLabel,
	SelectChangeEvent,
} from '@mui/material';

interface Permission {
	name: string;
	module: string;
	action: string;
}

const CreateRole: React.FC = () => {
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [permissions, setPermissions] = useState<Permission[]>([]);
	const [modules, setModules] = useState<{ id: string; name: string }[]>([]);
	const [actions, setActions] = useState<{ id: string; name: string }[]>([]);
	const [selectedModule, setSelectedModule] = useState('');
	const [selectedAction, setSelectedAction] = useState('');
	const { HOST, SERVICE } = getEnvVariables();

	useEffect(() => {
		const token = localStorage.getItem('token');
		if (!token) {
			console.error('No se encontró el token. Por favor, inicia sesión.');
			return;
		}

		const fetchPermissions = async () => {
			try {
				const response = await axios.get(`${HOST}${SERVICE}/permissions`, {
					headers: { Authorization: `Bearer ${token}` },
				});

				if (response.data) {
					setModules(response.data.modules);
					setActions(response.data.actions);
				} else {
					console.error('La respuesta no contiene los datos esperados.');
				}
			} catch (error) {
				console.error('Error al obtener permisos:', error);
			}
		};

		fetchPermissions();
	}, [HOST, SERVICE]);

	const addPermission = () => {
		if (selectedModule && selectedAction) {
			const moduleName = modules.find((mod) => mod.name === selectedModule)?.name || '';
			const actionName = actions.find((act) => act.name === selectedAction)?.name || '';
			const permissionName = `${moduleName}-${actionName}`;

			setPermissions([
				...permissions,
				{
					name: permissionName,
					module: selectedModule,
					action: selectedAction,
				},
			]);
			setSelectedModule('');
			setSelectedAction('');
		}
	};

	const removePermission = (index: number) => {
		setPermissions(permissions.filter((_, i) => i !== index));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (permissions.length === 0) {
			alert('Debe agregar al menos un permiso al rol.');
			return;
		}

		const token = localStorage.getItem('token');
		if (!token) {
			alert('No se encontró el token. Por favor, inicia sesión.');
			return;
		}

		try {
			console.log('Datos enviados:', { name, description, permissions });
			await axios.post(
				`${HOST}${SERVICE}/roles`,
				{ name, description, permissions },
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			alert('Rol creado exitosamente');
			// Restablecer estados si es necesario
		} catch (error) {
			if (error instanceof Error) {
				alert('Error al crear rol: ' + error.message);
			} else {
				console.error('Error desconocido:', error);
				alert('Error al crear rol');
			}
		}
	};

	return (
		<RoleContainer>
			<Title>Crear Nuevo Rol</Title>
			<form onSubmit={handleSubmit}>
				<FormField
					label="Nombre del Rol"
					variant="outlined"
					value={name}
					onChange={(e) => setName(e.target.value)}
					required
				/>
				<FormField
					label="Descripción"
					variant="outlined"
					multiline
					rows={3}
					value={description}
					onChange={(e) => setDescription(e.target.value)}
				/>

				<Typography variant="h6">Permisos</Typography>

				<FormControl variant="outlined" fullWidth margin="normal">
					<InputLabel id="module-label">Módulo</InputLabel>
					<Select
						labelId="module-label"
						label="Módulo"
						value={selectedModule}
						onChange={(e: SelectChangeEvent) => setSelectedModule(e.target.value)}
						MenuProps={{
							anchorOrigin: {
								vertical: 'bottom',
								horizontal: 'left',
						},
						}}
					>
						<MenuItem value="">
							<em>-- Seleccionar Módulo --</em>
						</MenuItem>
						{modules.map((module) => (
							<MenuItem key={module.id} value={module.name}>
								{module.name}
							</MenuItem>
						))}
					</Select>
				</FormControl>

				<FormControl variant="outlined" fullWidth margin="normal">
					<InputLabel id="action-label">Acción</InputLabel>
					<Select
						labelId="action-label"
						label="Acción"
						value={selectedAction}
						onChange={(e: SelectChangeEvent) => setSelectedAction(e.target.value)}
						MenuProps={{
							anchorOrigin: {
								vertical: 'bottom',
								horizontal: 'left',
						},
						}}
					>
						<MenuItem value="">
							<em>-- Seleccionar Acción --</em>
						</MenuItem>
						{actions.map((action) => (
							<MenuItem key={action.id} value={action.name}>
								{action.name}
							</MenuItem>
						))}
					</Select>
				</FormControl>

				<AddPermissionButton
					variant="contained"
					color="primary"
					onClick={addPermission}
					fullWidth
				>
					Agregar Permiso
				</AddPermissionButton>

				<PermissionList>
					{permissions.map((perm, index) => (
						<PermissionItem key={index}>
							<Typography>
								{perm.module} - {perm.action}
							</Typography>
							<Button
								variant="outlined"
								color="secondary"
								onClick={() => removePermission(index)}
							>
								Eliminar
							</Button>
						</PermissionItem>
					))}
				</PermissionList>

				<SubmitButton type="submit" variant="contained" color="primary" fullWidth>
					Crear Rol
				</SubmitButton>
			</form>
		</RoleContainer>
	);
};

export default CreateRole;

