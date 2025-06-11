import React, { useState, useEffect } from 'react';
import {
	Box, Button, Typography, FormControl, Select, InputLabel,
	MenuItem, List, ListItem, ListItemText,
} from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';

import {
	listGroups,
	listGroupMembers,
	addUserToGroup,
	removeUserFromGroup,
} from '../../../async/services/groupService';
import { listUsers } from '../../../async/services/userService';

import { Group } from '../../../types/types';
import { User } from '../../../types/User';

const GroupUser: React.FC = () => {
	const [groups, setGroups]           = useState<Group[]>([]);
	const [users, setUsers]             = useState<User[]>([]);
	const [groupMembers, setGroupMembers] = useState<User[]>([]);

	const [groupId,        setGroupId]        = useState('');
	const [userToAddId,    setUserToAddId]    = useState('');
	const [userToRemoveId, setUserToRemoveId] = useState('');
	const [message,        setMessage]        = useState('');

	/* cargar grupos y usuarios una sola vez */
	useEffect(() => {
		listGroups().then(setGroups).catch(err => console.error('Grupos:', err));
		listUsers().then(setUsers).catch(err => console.error('Usuarios:', err));
	}, []);

	/* cargar miembros cuando cambia el grupo */
	useEffect(() => {
		if (groupId) {
			listGroupMembers(groupId)
			.then(setGroupMembers)
			.catch(err => {
				console.error('Miembros:', err);
				setGroupMembers([]);
			});
		} else {
			setGroupMembers([]);
		}
	}, [groupId]);

	/* --- handlers --- */
	const handleAddUser = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const { group } = await addUserToGroup(groupId, userToAddId);
			setMessage(`Usuario agregado a ${group.name}`);
			setUserToAddId('');
			const members = await listGroupMembers(groupId);
			setGroupMembers(members);
		} catch (err) {
			console.error(err);
			setMessage('Error al agregar usuario');
		}
	};

	const handleRemoveUser = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const { group } = await removeUserFromGroup(groupId, userToRemoveId);
			setMessage(`Usuario eliminado de ${group.name}`);
			setUserToRemoveId('');
			const members = await listGroupMembers(groupId);
			setGroupMembers(members);
		} catch (err) {
			console.error(err);
			setMessage('Error al eliminar usuario');
		}
	};

	/* --- UI --- */
	return (
		<Box sx={{ p: 3 }}>
			<Typography variant="h5" gutterBottom>
				<GroupIcon sx={{ mr: 1 }} />
				Gestión de Usuarios del Grupo
			</Typography>

			{message && <Typography color="primary">{message}</Typography>}

			{/* selector de grupo */}
			<FormControl fullWidth sx={{ mb: 2 }}>
				<InputLabel>Seleccionar Grupo</InputLabel>
				<Select value={groupId} label="Seleccionar Grupo" onChange={e => setGroupId(e.target.value)}>
					<MenuItem value=""><em>Seleccione un grupo</em></MenuItem>
					{groups.map(g => (
						<MenuItem key={g._id} value={g._id}>{g.name}</MenuItem>
					))}
				</Select>
			</FormControl>

			{groupId && (
				<>
					{/* botón refrescar miembros */}
					<Box sx={{ display: 'flex', mb: 2 }}>
						<Button
							variant="contained"
							onClick={() => listGroupMembers(groupId).then(setGroupMembers)}
							startIcon={<GroupIcon />}
						>
							Ver Miembros del Grupo
						</Button>
					</Box>

					{/* listado de miembros */}
					{groupMembers.length > 0 && (
						<List sx={{ mb: 3 }}>
							<Typography variant="h6">Miembros del Grupo</Typography>
							{groupMembers.map(m => (
								<ListItem key={m._id}>
									<ListItemText primary={`${m.username} (${m.email})`} />
								</ListItem>
							))}
						</List>
					)}

					{/* formulario agregar */}
					<Box component="form" onSubmit={handleAddUser} sx={{ mb: 3 }}>
						<Typography variant="h6">Agregar Usuario al Grupo</Typography>
						<FormControl fullWidth sx={{ mt: 1 }}>
							<InputLabel>Seleccionar Usuario</InputLabel>
							<Select
								value={userToAddId}
								label="Seleccionar Usuario"
								onChange={e => setUserToAddId(e.target.value)}
								required
							>
								<MenuItem value=""><em>Seleccione un usuario</em></MenuItem>
								{users.map(u => (
									<MenuItem key={u._id} value={u._id}>{u.username}</MenuItem>
								))}
							</Select>
						</FormControl>
						<Button
							type="submit"
							variant="contained"
							color="success"
							startIcon={<PersonAddIcon />}
							sx={{ mt: 1 }}
						>
							Agregar Usuario
						</Button>
					</Box>

		  {/* formulario eliminar */}
					<Box component="form" onSubmit={handleRemoveUser}>
						<Typography variant="h6">Eliminar Usuario del Grupo</Typography>
						<FormControl fullWidth sx={{ mt: 1 }}>
							<InputLabel>Seleccionar Miembro</InputLabel>
							<Select
								value={userToRemoveId}
								label="Seleccionar Miembro"
								onChange={e => setUserToRemoveId(e.target.value)}
								required
							>
								<MenuItem value=""><em>Seleccione un miembro</em></MenuItem>
								{groupMembers.map(m => (
									<MenuItem key={m._id} value={m._id}>{m.username}</MenuItem>
								))}
							</Select>
						</FormControl>
						<Button
							type="submit"
							variant="contained"
							color="error"
							startIcon={<PersonRemoveIcon />}
							sx={{ mt: 1 }}
						>
							Eliminar Usuario
						</Button>
					</Box>
				</>
			)}
		</Box>
	);
};

export default GroupUser;

