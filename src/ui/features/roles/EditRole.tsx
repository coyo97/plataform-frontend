import React, { useState, useEffect } from 'react';

import {
	Select,
	MenuItem,
	FormControl,
	InputLabel,
} from '@mui/material';

import SectionTitle from '../../shared/atoms/titles/SectionTitle';
import Text from '../../shared/atoms/typography/Text';
import TextField from '../../shared/atoms/textFields/TextField';
import SmartBox from '../../shared/atoms/box/SmartBox';
import FilledButton from '../../shared/atoms/buttons/filledButton/FilledButton';

import { fetchRoleById, updateRole } from '../../../async/services/roleService';
import { fetchPermissions } from '../../../async/services/permissionService';

interface Permission {
	_id: string;
	name: string;
	module?: { name: string };
	action?: { name: string };
}

const EditRole: React.FC<{ roleId: string }> = ({ roleId }) => {
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [permissions, setPermissions] = useState<Permission[]>([]);
	const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const loadData = async () => {
			try {
				const res = await fetchRoleById(roleId);
				const role = res.role;

				setName(role.name);
				setDescription(role.description || '');
				setSelectedPermissions(role.permissions.map((p: any) => p._id));
			} catch (error) {
				console.error('Error al cargar el rol:', error);
				alert('No se pudo cargar el rol');
			}

			try {
				const permissionsList = await fetchPermissions();
				setPermissions(permissionsList);
			} catch (error) {
				console.error('Error al cargar permisos:', error);
				alert('No se pudo cargar los permisos');
			} finally {
				setLoading(false);
			}
		};

		loadData();
	}, [roleId]);

	const handleSubmit = async () => {
		try {
			await updateRole(roleId, {
				name,
				description,
				permissions: selectedPermissions,
			});
			alert('Rol actualizado exitosamente');
		} catch (error) {
			console.error('Error al actualizar el rol:', error);
			alert('No se pudo actualizar el rol');
		}
	};

	if (loading) return <Text>Cargando...</Text>;

	return (
		<SmartBox column gap="md">
			<SectionTitle>Editar Rol</SectionTitle>

			<TextField
				label="Nombre del Rol"
				value={name}
				onChange={(val) => setName(val)}
				placeholder="Nombre del rol"
			/>

			<TextField
				label="Descripción"
				value={description}
				onChange={(val) => setDescription(val)}
				multiline
				rows={3}
				placeholder="Descripción del rol"
			/>

			<Text size="md" weight="bold">Permisos</Text>

			<FormControl fullWidth margin="normal">
				<InputLabel id="perm-label">Permisos</InputLabel>
				<Select
					labelId="perm-label"
					multiple
					value={selectedPermissions}
					onChange={(e) => setSelectedPermissions(e.target.value as string[])}
					renderValue={(selected) =>
						permissions
							.filter(p => selected.includes(p._id))
							.map(p => `${p.module?.name || 'Módulo'} - ${p.action?.name || 'Acción'}`)
							.join(', ')
					}
				>
					{permissions.map((perm) => (
						<MenuItem key={perm._id} value={perm._id}>
							<input
								type="checkbox"
								checked={selectedPermissions.includes(perm._id)}
								readOnly
								style={{ marginRight: 8 }}
							/>
							{`${perm.module?.name || 'Módulo'} - ${perm.action?.name || 'Acción'}`}
						</MenuItem>
					))}
				</Select>
			</FormControl>

			<FilledButton colorType="primary" onClick={handleSubmit}>
				Guardar Cambios
			</FilledButton>
		</SmartBox>
	);
};

export default EditRole;

