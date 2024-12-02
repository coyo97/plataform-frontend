// EditRole.tsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import getEnvVariables from '../../../config/configEnvs';
import {
	Typography,
	TextField,
	Button,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
} from '@mui/material';

interface Permission {
	_id: string;
	name: string;
	module: { name: string };
	action: { name: string };
}

interface Role {
	_id: string;
	name: string;
	description?: string;
	permissions: Permission[];
}

interface EditRoleProps {
	roleId: string;
}

const EditRole: React.FC<EditRoleProps> = ({ roleId }) => {
	const [role, setRole] = useState<Role | null>(null);
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [permissions, setPermissions] = useState<Permission[]>([]);
	const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
	const { HOST, SERVICE } = getEnvVariables();

	useEffect(() => {
		const token = localStorage.getItem('token');
		if (!token) {
			console.error('No se encontró el token. Por favor, inicia sesión.');
			return;
		}

		const fetchRole = async () => {
			try {
				const response = await axios.get(`${HOST}${SERVICE}/roles/${roleId}`, {
					headers: { Authorization: `Bearer ${token}` },
				});

				if (response.data && response.data.role) {
					const roleData = response.data.role;
					setRole(roleData);
					setName(roleData.name);
					setDescription(roleData.description || '');
					setSelectedPermissions(roleData.permissions.map((perm: Permission) => perm._id));
				} else {
					console.error('La respuesta no contiene el rol esperado.');
				}
			} catch (error) {
				console.error('Error al obtener el rol:', error);
				alert('Error al obtener el rol');
			}
		};

		const fetchPermissions = async () => {
			try {
				const response = await axios.get(`${HOST}${SERVICE}/permissions`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				if (response.data && response.data.permissions) {
					setPermissions(response.data.permissions);
				} else {
					console.error('La respuesta no contiene los permisos esperados.');
				}
			} catch (error) {
				console.error('Error al obtener permisos:', error);
			}
		};

		fetchRole();
		fetchPermissions();
	}, [HOST, SERVICE, roleId]);

	const handleEditRole = async () => {
		const token = localStorage.getItem('token');
		if (!token) {
			console.error('No se encontró el token. Por favor, inicia sesión.');
			return;
		}

		try {
			await axios.put(
				`${HOST}${SERVICE}/roles/${roleId}`,
				{ name, description, permissions: selectedPermissions },
				{ headers: { Authorization: `Bearer ${token}` } }
			);

			alert('Rol actualizado exitosamente');
			// Opcional: Redirigir o actualizar la lista de roles
		} catch (error) {
			console.error('Error al actualizar rol:', error);
			alert('Error al actualizar rol');
		}
	};

	if (!role) return <div>Cargando...</div>;

	return (
		<div>
			<Typography variant="h4">Editar Rol</Typography>
			<div>
				<TextField
					label="Nombre del Rol"
					value={name}
					onChange={(e) => setName(e.target.value)}
					fullWidth
					margin="normal"
				/>
			</div>
			<div>
				<TextField
					label="Descripción"
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					fullWidth
					margin="normal"
					multiline
					rows={3}
				/>
			</div>

			<Typography variant="h6">Seleccionar Permisos</Typography>
			<FormControl variant="outlined" fullWidth margin="normal">
				<InputLabel id="permissions-label">Permisos</InputLabel>
				<Select
					labelId="permissions-label"
					label="Permisos"
					multiple
					value={selectedPermissions}
					onChange={(e) => setSelectedPermissions(e.target.value as string[])}
					renderValue={(selected) =>
						permissions
					.filter((perm) => selected.includes(perm._id))
					.map((perm) => `${perm.module?.name || 'Sin módulo'} - ${perm.action?.name || 'Sin acción'}`)
					.join(', ')
					}

					MenuProps={{
						anchorOrigin: {
							vertical: 'bottom',
							horizontal: 'left',
					},
					}}
				>
					{permissions.map((perm) => (
						<MenuItem key={perm._id} value={perm._id}>
							<input
								type="checkbox"
								checked={selectedPermissions.includes(perm._id)}
								onChange={() => {}}
							/>
							{(perm.module?.name || 'Sin módulo')} - {(perm.action?.name || 'Sin acción')}
						</MenuItem>
					))}

				</Select>
			</FormControl>

			<Button variant="contained" color="primary" onClick={handleEditRole} fullWidth>
				Guardar Cambios
			</Button>
		</div>
	);
};

export default EditRole;

