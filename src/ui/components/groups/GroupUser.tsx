// src/ui/components/GroupManagement.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import getEnvVariables from '../../../config/configEnvs';

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
	const token = localStorage.getItem('token'); // Asegúrate de obtener el token de autenticación

	// Obtener los grupos a los que pertenece el usuario
	useEffect(() => {
		const fetchGroups = async () => {
			try {
				const response = await axios.get(`${HOST}${SERVICE}/groups`, {
					headers: {
						'Authorization': `Bearer ${token}`
					}
				});
				setGroups(response.data.groups);
			} catch (error) {
				console.error('Error al obtener los grupos:', error);
			}
		};

		fetchGroups();
	}, [HOST, SERVICE, token]);

	// Obtener todos los usuarios
	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const response = await axios.get(`${HOST}${SERVICE}/users`, {
					headers: {
						'Authorization': `Bearer ${token}`
					}
				});
				setUsers(response.data.list);
			} catch (error) {
				console.error('Error al obtener los usuarios:', error);
			}
		};

		fetchUsers();
	}, [HOST, SERVICE, token]);

	// Función para agregar un usuario al grupo
	const handleAddUser = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const response = await axios.post(`${HOST}${SERVICE}/groups/${groupId}/addUser`, { userToAddId }, {
				headers: {
					'Authorization': `Bearer ${token}`,
					'Content-Type': 'application/json'
				}
			});
			setMessage(`Usuario agregado al grupo: ${response.data.group.name}`);
			// Actualizar la lista de miembros
			fetchGroupMembers(groupId);
		} catch (error) {
			console.error('Error al agregar usuario:', error);
			setMessage('Error al agregar usuario');
		}
	};

	// Función para eliminar un usuario del grupo
	const handleRemoveUser = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const response = await axios.post(`${HOST}${SERVICE}/groups/${groupId}/removeUser`, { userToRemoveId }, {
				headers: {
					'Authorization': `Bearer ${token}`,
					'Content-Type': 'application/json'
				}
			});
			setMessage(`Usuario eliminado del grupo: ${response.data.group.name}`);
			// Actualizar la lista de miembros
			fetchGroupMembers(groupId);
		} catch (error) {
			console.error('Error al eliminar usuario:', error);
			setMessage('Error al eliminar usuario');
		}
	};

	// Función para obtener los miembros de un grupo
	const fetchGroupMembers = async (groupId: string) => {
		try {
			const response = await axios.get(`${HOST}${SERVICE}/groups/${groupId}/members`, {
				headers: {
					'Authorization': `Bearer ${token}`
				}
			});
			setGroupMembers(response.data.members);
		} catch (error) {
			console.error('Error al obtener los miembros del grupo:', error);
			setMessage('Error al obtener los miembros del grupo');
		}
	};

	// Actualizar los miembros cuando se selecciona un grupo
	useEffect(() => {
		if (groupId) {
			fetchGroupMembers(groupId);
		} else {
			setGroupMembers([]);
		}
	}, [groupId]);

	return (
		<div style={{ padding: '20px' }}>
			<h1>Gestión de Usuarios del Grupo</h1>
			{message && <p>{message}</p>}

			<label>
				Seleccionar Grupo:
				<select value={groupId} onChange={(e) => setGroupId(e.target.value)}>
					<option value="">Seleccione un grupo</option>
					{groups.map(group => (
						<option key={group._id} value={group._id}>{group.name}</option>
					))}
				</select>
			</label>

			{groupId && (
				<>
					<button onClick={() => fetchGroupMembers(groupId)}>
						Ver Miembros del Grupo
					</button>

					{groupMembers.length > 0 && (
						<div>
							<h2>Miembros del Grupo:</h2>
							<ul>
								{groupMembers.map(member => (
									<li key={member._id}>{member.username} ({member.email})</li>
								))}
							</ul>
						</div>
					)}

					<form onSubmit={handleAddUser} style={{ marginBottom: '20px' }}>
						<h2>Agregar Usuario al Grupo</h2>
						<label>
							Seleccionar Usuario a Agregar:
							<select value={userToAddId} onChange={(e) => setUserToAddId(e.target.value)} required>
								<option value="">Seleccione un usuario</option>
								{users.map(user => (
									<option key={user._id} value={user._id}>{user.username}</option>
								))}
							</select>
						</label>
						<button type="submit">Agregar Usuario</button>
					</form>

					<form onSubmit={handleRemoveUser}>
						<h2>Eliminar Usuario del Grupo</h2>
						<label>
							Seleccionar Usuario a Eliminar:
							<select value={userToRemoveId} onChange={(e) => setUserToRemoveId(e.target.value)} required>
								<option value="">Seleccione un usuario</option>
								{groupMembers.map(member => (
									<option key={member._id} value={member._id}>{member.username}</option>
								))}
							</select>
						</label>
						<button type="submit">Eliminar Usuario</button>
					</form>
				</>
			)}
		</div>
	);
};

export default GroupUser;

