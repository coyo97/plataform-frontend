import React, { useState, useEffect } from 'react';
import axios from 'axios';
import getEnvVariables from '../../../config/configEnvs';

interface User {
	_id: string;
	username: string;
	email: string;
	roles: any[];
}

interface Role {
	_id: string;
	name: string;
}

const AssignRolesToUser: React.FC = () => {
	const [users, setUsers] = useState<User[]>([]);
	const [roles, setRoles] = useState<Role[]>([]);
	const [selectedUserId, setSelectedUserId] = useState('');
	const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
	const { HOST, SERVICE } = getEnvVariables();

	useEffect(() => {
		const token = localStorage.getItem('token');
		if (!token) {
			console.error('No se encontró el token. Por favor, inicia sesión.');
			return;
		}

		const fetchData = async () => {
			try {
				// Obtener usuarios
				const usersResponse = await axios.get(`${HOST}${SERVICE}/users`, {
					headers: { Authorization: `Bearer ${token}` },
				});

				// Asegúrate de acceder correctamente a los datos
				if (usersResponse.data && usersResponse.data.users) {
					setUsers(usersResponse.data.users);
				} else if (usersResponse.data && usersResponse.data.list) {
					setUsers(usersResponse.data.list);
				} else {
					console.error('La respuesta de usuarios no contiene los datos esperados.');
				}

				// Obtener roles
				const rolesResponse = await axios.get(`${HOST}${SERVICE}/roles`, {
					headers: { Authorization: `Bearer ${token}` },
				});

				if (rolesResponse.data && rolesResponse.data.roles) {
					setRoles(rolesResponse.data.roles);
				} else {
					console.error('La respuesta de roles no contiene los datos esperados.');
				}
			} catch (error) {
				console.error('Error al obtener usuarios o roles:', error);
				alert('Error al obtener datos');
			}
		};

		fetchData();
	}, [HOST, SERVICE]);

	const handleAssignRoles = async () => {
		if (!selectedUserId) {
			alert('Por favor, selecciona un usuario.');
			return;
		}

		const token = localStorage.getItem('token');
		if (!token) {
			console.error('No se encontró el token. Por favor, inicia sesión.');
			return;
		}

		try {
			// Enviar solicitud para asignar roles
			const response = await axios.put(
				`${HOST}${SERVICE}/users/${selectedUserId}/roles`,
				{ roles: selectedRoles },
				{ headers: { Authorization: `Bearer ${token}` } }
			);

			// Opcional: Actualizar la lista de usuarios para reflejar los cambios
			const updatedUser = response.data.user;
			setUsers(prevUsers =>
					 prevUsers.map(user => (user._id === updatedUser._id ? updatedUser : user))
					);

					alert('Roles asignados correctamente');
		} catch (error) {
			console.error('Error al asignar roles:', error);
			alert('Error al asignar roles');
		}
	};

	return (
		<div>
			<h2>Asignar Roles a Usuarios</h2>
			<div>
				<label>Seleccionar Usuario:</label>
				<select value={selectedUserId} onChange={e => {
					setSelectedUserId(e.target.value);
					// Opcional: Actualizar los roles seleccionados con los roles actuales del usuario
					const selectedUser = users.find(user => user._id === e.target.value);
					if (selectedUser && selectedUser.roles && Array.isArray(selectedUser.roles)) {
						setSelectedRoles(selectedUser.roles.map(role => role._id));
					} else {
						setSelectedRoles([]);
					}

				}}>
					<option value="">-- Seleccionar Usuario --</option>
					{users.map(user => (
						<option key={user._id} value={user._id}>
							{user.username} ({user.email})
						</option>
					))}
				</select>
			</div>
			<div>
				<h3>Seleccionar Roles:</h3>
				{roles.map(role => (
					<div key={role._id}>
						<input
							type="checkbox"
							value={role._id}
							checked={selectedRoles.includes(role._id)}
							onChange={e => {
								const roleId = e.target.value;
								setSelectedRoles(prev =>
												 prev.includes(roleId)
													 ? prev.filter(id => id !== roleId)
													 : [...prev, roleId]
												);
							}}
						/>
						<label>{role.name}</label>
					</div>
				))}
			</div>
			<button onClick={handleAssignRoles}>Asignar Roles</button>
		</div>
	);
};

export default AssignRolesToUser;

