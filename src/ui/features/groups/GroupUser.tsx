import React, { useState, useEffect } from 'react';
import axios from 'axios';
import getEnvVariables from '../../../config/configEnvs';
import {
	Box,
	Button,
	Typography,
	TextField,
	MenuItem,
	FormControl,
	Select,
	InputLabel,
	List,
	ListItem,
	ListItemText,
	IconButton,
} from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';

interface Group {
	_id: string;
	name: string;
}

interface User {
	_id: string;
	username: string;
	email?: string;
}

const GroupUser: React.FC = () => {
	const [groupId, setGroupId] = useState<string>('');
	const [userToAddId, setUserToAddId] = useState<string>('');
	const [userToRemoveId, setUserToRemoveId] = useState<string>('');
	const [message, setMessage] = useState<string>('');
	const { HOST, SERVICE } = getEnvVariables();
	const [groups, setGroups] = useState<Group[]>([]);
	const [users, setUsers] = useState<User[]>([]);
	const [groupMembers, setGroupMembers] = useState<User[]>([]);
	const token = localStorage.getItem('token');

	useEffect(() => {
		const fetchGroups = async () => {
			try {
				const response = await axios.get(`${HOST}${SERVICE}/groups`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				setGroups(response.data.groups);
			} catch (error) {
				console.error('Error al obtener los grupos:', error);
			}
		};

		fetchGroups();
	}, [HOST, SERVICE, token]);

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const response = await axios.get(`${HOST}${SERVICE}/users`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				setUsers(response.data.list);
			} catch (error) {
				console.error('Error al obtener los usuarios:', error);
			}
		};

		fetchUsers();
	}, [HOST, SERVICE, token]);

	const handleAddUser = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const response = await axios.post(
				`${HOST}${SERVICE}/groups/${groupId}/addUser`,
				{ userToAddId },
				{ headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
			);
			setMessage(`Usuario agregado al grupo: ${response.data.group.name}`);
			fetchGroupMembers(groupId);
		} catch (error) {
			console.error('Error al agregar usuario:', error);
			setMessage('Error al agregar usuario');
		}
	};

	const handleRemoveUser = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const response = await axios.post(
				`${HOST}${SERVICE}/groups/${groupId}/removeUser`,
				{ userToRemoveId },
				{ headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
			);
			setMessage(`Usuario eliminado del grupo: ${response.data.group.name}`);
			fetchGroupMembers(groupId);
		} catch (error) {
			console.error('Error al eliminar usuario:', error);
			setMessage('Error al eliminar usuario');
		}
	};

	const fetchGroupMembers = async (groupId: string) => {
		try {
			const response = await axios.get(`${HOST}${SERVICE}/groups/${groupId}/members`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			setGroupMembers(response.data.members);
		} catch (error) {
			console.error('Error al obtener los miembros del grupo:', error);
			setMessage('Error al obtener los miembros del grupo');
		}
	};

	useEffect(() => {
		if (groupId) {
			fetchGroupMembers(groupId);
		} else {
			setGroupMembers([]);
		}
	}, [groupId]);

	return (
		<Box sx={{ p: 3 }}>
			<Typography variant="h5" gutterBottom>
				<GroupIcon sx={{ mr: 1 }} />
				Gestión de Usuarios del Grupo
			</Typography>
			{message && <Typography color="primary">{message}</Typography>}

			<FormControl fullWidth sx={{ mb: 2 }}>
				<InputLabel>Seleccionar Grupo</InputLabel>
				<Select
					value={groupId}
					onChange={(e) => setGroupId(e.target.value)}
					label="Seleccionar Grupo"
				>
					<MenuItem value="">
						<em>Seleccione un grupo</em>
					</MenuItem>
					{groups.map((group) => (
						<MenuItem key={group._id} value={group._id}>
							{group.name}
						</MenuItem>
					))}
				</Select>
			</FormControl>

			{groupId && (
				<>
					<Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
						<Button
							variant="contained"
							color="primary"
							onClick={() => fetchGroupMembers(groupId)}
							startIcon={<GroupIcon />}
						>
							Ver Miembros del Grupo
						</Button>
					</Box>

					{groupMembers.length > 0 && (
						<List>
							<Typography variant="h6">Miembros del Grupo</Typography>
							{groupMembers.map((member) => (
								<ListItem key={member._id}>
									<ListItemText primary={`${member.username} (${member.email})`} />
								</ListItem>
							))}
						</List>
					)}

					<Box component="form" onSubmit={handleAddUser} sx={{ mb: 2 }}>
						<Typography variant="h6">Agregar Usuario al Grupo</Typography>
						<FormControl fullWidth sx={{ mt: 1 }}>
							<InputLabel>Seleccionar Usuario a Agregar</InputLabel>
							<Select
								value={userToAddId}
								onChange={(e) => setUserToAddId(e.target.value)}
								label="Seleccionar Usuario a Agregar"
								required
							>
								<MenuItem value="">
									<em>Seleccione un usuario</em>
								</MenuItem>
								{users.map((user) => (
									<MenuItem key={user._id} value={user._id}>
										{user.username}
									</MenuItem>
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

					<Box component="form" onSubmit={handleRemoveUser}>
						<Typography variant="h6">Eliminar Usuario del Grupo</Typography>
						<FormControl fullWidth sx={{ mt: 1 }}>
							<InputLabel>Seleccionar Usuario a Eliminar</InputLabel>
							<Select
								value={userToRemoveId}
								onChange={(e) => setUserToRemoveId(e.target.value)}
								label="Seleccionar Usuario a Eliminar"
								required
							>
								<MenuItem value="">
									<em>Seleccione un usuario</em>
								</MenuItem>
								{groupMembers.map((member) => (
									<MenuItem key={member._id} value={member._id}>
										{member.username}
									</MenuItem>
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

