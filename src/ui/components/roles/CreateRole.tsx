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
	Checkbox,
} from '@mui/material';

interface Module {
	_id: string;
	name: string;
}

interface Action {
	_id: string;
	name: string;
}

interface Permission {
	_id: string;
	name: string;
	module: Module;
	action: Action;
}

const CreateRole: React.FC = () => {
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [permissions, setPermissions] = useState<Permission[]>([]);
	const [modules, setModules] = useState<Module[]>([]);
	const [actions, setActions] = useState<Action[]>([]);
	const [selectedModules, setSelectedModules] = useState<string[]>([]);
	const [selectedActions, setSelectedActions] = useState<string[]>([]);
	const { HOST, SERVICE } = getEnvVariables();

	useEffect(() => {
		const token = localStorage.getItem('token');
		if (!token) {
			console.error('No se encontró el token. Por favor, inicia sesión.');
			return;
		}

		const fetchData = async () => {
			try {
				// Obtener módulos
				const modulesResponse = await axios.get(`${HOST}${SERVICE}/modules`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				if (modulesResponse.data && modulesResponse.data.modules) {
					setModules(modulesResponse.data.modules);
				} else {
					console.error('La respuesta no contiene los módulos esperados.');
				}

				// Obtener acciones
				const actionsResponse = await axios.get(`${HOST}${SERVICE}/actions`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				if (actionsResponse.data && actionsResponse.data.actions) {
					setActions(actionsResponse.data.actions);
				} else {
					console.error('La respuesta no contiene las acciones esperadas.');
				}
			} catch (error) {
				console.error('Error al obtener módulos o acciones:', error);
			}
		};

		fetchData();
	}, [HOST, SERVICE]);

	const addPermission = async () => {
		if (selectedModules.length === 0 || selectedActions.length === 0) {
			alert('Debe seleccionar al menos un módulo y una acción.');
			return;
		}

		const token = localStorage.getItem('token');
		if (!token) {
			console.error('No se encontró el token. Por favor, inicia sesión.');
			return;
		}

		try {
			const newPermissions: Permission[] = [];

			for (const moduleId of selectedModules) {
				const moduleName = modules.find((mod) => mod._id === moduleId)?.name || '';

				for (const actionId of selectedActions) {
					const actionName = actions.find((act) => act._id === actionId)?.name || '';

					// Verificar si el permiso ya existe en la lista local
					const existingPermission = permissions.find(
						(perm) =>
							perm.module._id === moduleId && perm.action._id === actionId
					);

					if (existingPermission) {
						continue; // Saltar si el permiso ya está agregado
					}

					// Crear el nombre del permiso combinando el módulo y la acción
					const permissionName = `${moduleName} - ${actionName}`;

					// Mostrar los datos que se enviarán al backend
					console.log('Enviando datos al backend:', {
						moduleId: moduleId,
						actionId: actionId,
						name: permissionName,
					});

					// Crear el permiso en el backend
					const response = await axios.post(
						`${HOST}${SERVICE}/permissions`,
						{
							moduleId: moduleId,
							actionId: actionId,
							name: permissionName,
						},
						{ headers: { Authorization: `Bearer ${token}` } }
					);

					if (response.data && response.data.permission) {
						newPermissions.push(response.data.permission);
					} else {
						console.error('Error al crear el permiso.');
					}
				}
			}

			setPermissions([...permissions, ...newPermissions]);

			// Limpiar las selecciones
			setSelectedModules([]);
			setSelectedActions([]);
		} catch (error) {
			if (axios.isAxiosError(error)) {
				console.error('Error al agregar el permiso:', error.response?.data || error.message);
				alert(`Error al agregar el permiso: ${error.response?.data?.message || error.message}`);
			} else {
				console.error('Error desconocido:', error);
				alert('Error desconocido al agregar el permiso');
			}
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
			const permissionIds = permissions.map((perm) => perm._id);
			await axios.post(
				`${HOST}${SERVICE}/roles`,
				{ name, description, permissions: permissionIds },
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			alert('Rol creado exitosamente');
			// Restablecer estados si es necesario
		} catch (error) {
			console.error('Error al crear rol:', error);
			alert('Error al crear rol');
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

				{/* Selector de Módulos */}
				<FormControl variant="outlined" fullWidth margin="normal">
					<InputLabel id="module-label">Módulo(s)</InputLabel>
					<Select
						labelId="module-label"
						label="Módulo(s)"
						multiple
						value={selectedModules}
						onChange={(e) => setSelectedModules(e.target.value as string[])}
						renderValue={(selected) =>
							modules
						.filter((module) => selected.includes(module._id))
						.map((module) => module.name)
						.join(', ')
						}
						MenuProps={{
							anchorOrigin: {
								vertical: 'bottom',
								horizontal: 'left',
						},
						}}
					>
						{modules.map((module) => (
							<MenuItem key={module._id} value={module._id}>
								<Checkbox checked={selectedModules.includes(module._id)} />
								{module.name}
							</MenuItem>
						))}
					</Select>
				</FormControl>

				{/* Selector de Acciones */}
				<FormControl variant="outlined" fullWidth margin="normal">
					<InputLabel id="action-label">Acción(es)</InputLabel>
					<Select
						labelId="action-label"
						label="Acción(es)"
						multiple
						value={selectedActions}
						onChange={(e) => setSelectedActions(e.target.value as string[])}
						renderValue={(selected) =>
							actions
						.filter((action) => selected.includes(action._id))
						.map((action) => action.name)
						.join(', ')
						}
						MenuProps={{
							anchorOrigin: {
								vertical: 'bottom',
								horizontal: 'left',
						},
						}}
					>
						{actions.map((action) => (
							<MenuItem key={action._id} value={action._id}>
								<Checkbox checked={selectedActions.includes(action._id)} />
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
								{perm.module.name} - {perm.action.name}
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

