// src/ui/components/admin/UserManagement.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import getEnvVariables from '../../../config/configEnvs';
import {
	Container,
	Title,
	Table,
	TableRow,
	TableHeader,
	TableCell,
	Button,
} from './userManagement.styles';

interface Role {
	_id: string;
	name: string;
}

interface User {
	_id: string;
	username: string;
	email: string;
	roles: Role[];
	status: string;
}

const UserManagement: React.FC = () => {

	const [list, setList] = useState<User[]>([]); // Cambiamos 'setUsers' a 'setList'
	const { HOST, SERVICE } = getEnvVariables();

	useEffect(() => {
		const token = localStorage.getItem('token');
		if (!token) {
			console.error('No se encontró el token. Por favor, inicia sesión.');
			return;
		}

		const fetchUsers = async () => {
			try {
				const response = await axios.get(`${HOST}${SERVICE}/users`, {
					headers: { Authorization: `Bearer ${token}` },
				});

				console.log('Response data:', response.data); // Agrega este log para depurar

				if (response.data && response.data.list) {
					setList(response.data.list);
				} else {
					console.error('La respuesta de usuarios no contiene los datos esperados.');
				}
			} catch (error) {
				console.error('Error al obtener usuarios:', error);
				alert('Error al obtener usuarios');
			}
		};

		fetchUsers();
	}, [HOST, SERVICE]);

	const handleDeactivate = async (userId: string) => {
		const confirm = window.confirm('¿Estás seguro de que deseas desactivar este usuario?');
		if (!confirm) return;

		const token = localStorage.getItem('token');
		if (!token) {
			console.error('No se encontró el token. Por favor, inicia sesión.');
			return;
		}

		try {
			await axios.put(
				`${HOST}${SERVICE}/users/${userId}/deactivate`,
				{},
				{ headers: { Authorization: `Bearer ${token}` } }
			);

			setList(prevList =>
					prevList.map(user =>
								 user._id === userId ? { ...user, status: 'deactivated' } : user
								)
				   );

				   alert('Usuario desactivado exitosamente.');
		} catch (error) {
			console.error('Error al desactivar usuario:', error);
			alert('Error al desactivar usuario');
		}
	};

	const handleReactivate = async (userId: string) => {
		const confirm = window.confirm('¿Estás seguro de que deseas reactivar este usuario?');
		if (!confirm) return;

		const token = localStorage.getItem('token');
		if (!token) {
			console.error('No se encontró el token. Por favor, inicia sesión.');
			return;
		}

		try {
			await axios.put(
				`${HOST}${SERVICE}/users/${userId}/reactivate`,
				{},
				{ headers: { Authorization: `Bearer ${token}` } }
			);

			setList(prevList =>
					prevList.map(user =>
								 user._id === userId ? { ...user, status: 'active' } : user
								)
				   );

				   alert('Usuario reactivado exitosamente.');
		} catch (error) {
			console.error('Error al reactivar usuario:', error);
			alert('Error al reactivar usuario');
		}
	};

	const handleBlacklist = async (userId: string) => {
		const confirm = window.confirm('¿Estás seguro de que deseas bloquear este usuario? Esta acción no puede deshacerse.');
		if (!confirm) return;

		const token = localStorage.getItem('token');
		if (!token) {
			console.error('No se encontró el token. Por favor, inicia sesión.');
			return;
		}

		try {
			await axios.put(
				`${HOST}${SERVICE}/users/${userId}/blacklist`,
				{},
				{ headers: { Authorization: `Bearer ${token}` } }
			);

			setList(prevList =>
					prevList.map(user =>
								 user._id === userId ? { ...user, status: 'blacklisted' } : user
								)
				   );

				   alert('Usuario bloqueado exitosamente.');
		} catch (error) {
			console.error('Error al bloquear usuario:', error);
			alert('Error al bloquear usuario');
		}
	};

	return (
		<Container>
			<Title>Gestión de Usuarios</Title>
			<Table>
				<thead>
					<TableRow>
						<TableHeader>Usuario</TableHeader>
						<TableHeader>Email</TableHeader>
						<TableHeader>Roles</TableHeader>
						<TableHeader>Estado</TableHeader>
						<TableHeader>Acciones</TableHeader>
					</TableRow>
				</thead>
				<tbody>
					{list.map(user => (
						<TableRow key={user._id}>
							<TableCell>{user.username}</TableCell>
							<TableCell>{user.email}</TableCell>
							<TableCell>
								{user.roles && user.roles.length > 0
									? user.roles.map(role => role.name).join(', ')
									: 'Sin roles'}
							</TableCell>
							<TableCell>{user.status || 'Sin estado'}</TableCell>
							<TableCell>
								{user.status === 'active' && (
									<>
										<Button onClick={() => handleDeactivate(user._id)}>Desactivar</Button>
										<Button onClick={() => handleBlacklist(user._id)}>Bloquear</Button>
									</>
								)}
								{user.status === 'deactivated' && (
									<>
										<Button onClick={() => handleReactivate(user._id)}>Reactivar</Button>
										<Button onClick={() => handleBlacklist(user._id)}>Bloquear</Button>
									</>
								)}
								{user.status === 'blacklisted' && <span>Usuario bloqueado</span>}
							</TableCell>
						</TableRow>
					))}
				</tbody>
			</Table>
		</Container>
	);
};

export default UserManagement;

