// src/ui/components/GroupManagement.tsx
import React, { useState } from 'react';
import axios from 'axios';
import getEnvVariables from '../../../config/configEnvs';

const GroupUser: React.FC = () => {
	const [groupId, setGroupId] = useState<string>('');
	const [userToAddId, setUserToAddId] = useState<string>('');
	const [userToRemoveId, setUserToRemoveId] = useState<string>('');
	const [message, setMessage] = useState<string>('');
	const {HOST, SERVICE} = getEnvVariables();


	// Función para agregar un usuario al grupo
	const handleAddUser = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const response = await axios.post(`${HOST}${SERVICE}/${groupId}/addUser`, { userToAddId });
			setMessage(`Usuario agregado: ${response.data.group.name}`);
		} catch (error) {
			console.error('Error al agregar usuario:', error);
			setMessage('Error al agregar usuario');
		}
	};

	// Función para eliminar un usuario del grupo
	const handleRemoveUser = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const response = await axios.post(`${HOST}${SERVICE}/${groupId}/removeUser`, { userToRemoveId });
			setMessage(`Usuario eliminado: ${response.data.group.name}`);
		} catch (error) {
			console.error('Error al eliminar usuario:', error);
			setMessage('Error al eliminar usuario');
		}
	};

	return (
		<div style={{ padding: '20px' }}>
			<h1>Gestión de Usuarios del Grupo</h1>
			{message && <p>{message}</p>}

			<form onSubmit={handleAddUser} style={{ marginBottom: '20px' }}>
				<h2>Agregar Usuario al Grupo</h2>
				<input
					type="text"
					placeholder="ID del Grupo"
					value={groupId}
					onChange={(e) => setGroupId(e.target.value)}
					required
				/>
				<input
					type="text"
					placeholder="ID del Usuario a Agregar"
					value={userToAddId}
					onChange={(e) => setUserToAddId(e.target.value)}
					required
				/>
				<button type="submit">Agregar Usuario</button>
			</form>

			<form onSubmit={handleRemoveUser}>
				<h2>Eliminar Usuario del Grupo</h2>
				<input
					type="text"
					placeholder="ID del Grupo"
					value={groupId}
					onChange={(e) => setGroupId(e.target.value)}
					required
				/>
				<input
					type="text"
					placeholder="ID del Usuario a Eliminar"
					value={userToRemoveId}
					onChange={(e) => setUserToRemoveId(e.target.value)}
					required
				/>
				<button type="submit">Eliminar Usuario</button>
			</form>
		</div>
	);
};

export default GroupUser;

