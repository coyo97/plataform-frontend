import React, { useState, useEffect } from 'react';

import { fetchModules }     from '../../../async/services/moduleService';
import { fetchActions }     from '../../../async/services/actionService';
import { createPermission } from '../../../async/services/permissionService';
import { createRole }       from '../../../async/services/roleService';

import SectionTitle from '../../shared/atoms/titles/SectionTitle';
import MainInput from '../../shared/atoms/inputs/MainInput';
import Text from '../../shared/atoms/typography/Text';
import FilledButton from '../../shared/atoms/buttons/filledButton/FilledButton';
import GhostButton from '../../shared/atoms/buttons/ghostButton/GhostButton';
import SmartBox from '../../shared/atoms/box/SmartBox';

import {
	RoleContainer,
	PermissionList,
	PermissionItem,
} from './createRole.styles';

import {
	Button, Typography, MenuItem, Select, FormControl, InputLabel, Checkbox,
} from '@mui/material';

interface Module { _id: string; name: string; }
interface Action { _id: string; name: string; }
interface Permission {
	_id: string; name: string; module: Module; action: Action;
}

const CreateRole: React.FC = () => {
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [permissions, setPermissions] = useState<Permission[]>([]);
	const [modules, setModules] = useState<Module[]>([]);
	const [actions, setActions] = useState<Action[]>([]);
	const [selectedModules, setSelectedModules] = useState<string[]>([]);
	const [selectedActions, setSelectedActions] = useState<string[]>([]);

	useEffect(() => {
		fetchModules().then(setModules);
		fetchActions().then(setActions);
	}, []);

	const addPermission = async () => {
		if (!selectedModules.length || !selectedActions.length) {
			return alert('Seleccione módulo(s) y acción(es)');
		}

		try {
			const newPerms: Permission[] = [];

			for (const modId of selectedModules) {
				const mod = modules.find(m => m._id === modId)!;

				for (const actId of selectedActions) {
					if (permissions.some(p => p.module._id === modId && p.action._id === actId)) continue;

					const act = actions.find(a => a._id === actId)!;
					const namePerm = `${mod.name} - ${act.name}`;

					const { permission } = await createPermission({
						moduleId: modId,
						actionId: actId,
						name: namePerm,
					});

					newPerms.push({ ...permission, module: mod, action: act });
				}
			}

			setPermissions(prev => [...prev, ...newPerms]);
			setSelectedModules([]);
			setSelectedActions([]);
		} catch (err: any) {
			console.error(err);
			alert('Error al agregar permiso');
		}
	};

	const removePermission = (i: number) =>
		setPermissions(prev => prev.filter((_, idx) => idx !== i));

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!permissions.length) return alert('Agregue al menos un permiso');

		try {
			const ids = permissions.map(p => p._id);
			await createRole({ name, description, permissions: ids });
			alert('Rol creado exitosamente');
			// TODO: resetear formulario si se desea
		} catch {
			alert('Error al crear rol');
		}
	};

	return (
		<RoleContainer>
			<SectionTitle>Crear Nuevo Rol</SectionTitle>

			<form onSubmit={handleSubmit}>
				<SmartBox column gap={3}>
					<MainInput
						label="Nombre del Rol"
						value={name}
						onChange={setName}
						placeholder="Ej. Administrador"
					/>

					<MainInput
						label="Descripción"
						value={description}
						onChange={setDescription}
						placeholder="Ej. Tiene acceso completo al sistema"
						multiline
						rows={3}
					/>

					<Text size="lg" weight="medium">Permisos</Text>

					{/* Módulos */}
					<FormControl fullWidth margin="normal">
						<InputLabel id="module-label">Módulo(s)</InputLabel>
						<Select
							labelId="module-label"
							multiple
							value={selectedModules}
							onChange={e => setSelectedModules(e.target.value as string[])}
							renderValue={sel =>
								modules.filter(m => sel.includes(m._id)).map(m => m.name).join(', ')
							}
						>
							{modules.map(m => (
								<MenuItem key={m._id} value={m._id}>
									<Checkbox checked={selectedModules.includes(m._id)} />
									{m.name}
								</MenuItem>
							))}
						</Select>
					</FormControl>

					{/* Acciones */}
					<FormControl fullWidth margin="normal">
						<InputLabel id="action-label">Acción(es)</InputLabel>
						<Select
							labelId="action-label"
							multiple
							value={selectedActions}
							onChange={e => setSelectedActions(e.target.value as string[])}
							renderValue={sel =>
								actions.filter(a => sel.includes(a._id)).map(a => a.name).join(', ')
							}
						>
							{actions.map(a => (
								<MenuItem key={a._id} value={a._id}>
									<Checkbox checked={selectedActions.includes(a._id)} />
									{a.name}
								</MenuItem>
							))}
						</Select>
					</FormControl>

					<FilledButton onClick={addPermission}>Agregar Permiso</FilledButton>

					<PermissionList>
						{permissions.map((p, i) => (
							<PermissionItem key={i}>
								<Text size="md">{p.module.name} - {p.action.name}</Text>
								<GhostButton label="Eliminar" onClick={() => removePermission(i)} />
							</PermissionItem>
						))}
					</PermissionList>

					<FilledButton type="submit">Crear Rol</FilledButton>
				</SmartBox>
			</form>
		</RoleContainer>
	);
};

export default CreateRole;

