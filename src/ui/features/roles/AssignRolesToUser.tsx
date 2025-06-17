import React, { useState, useEffect } from 'react';
import {
	Container,
	CheckboxContainer,
} from './assignRolesToUser.styles';

import SmartBox from '../../shared/atoms/box/SmartBox';
import SectionTitle from '../../shared/atoms/titles/SectionTitle';
import FilledButton from '../../shared/atoms/buttons/filledButton/FilledButton';
import Text from '../../shared/atoms/typography/Text';

import {
	ListItemText,
	Autocomplete,
	TextField,
} from '@mui/material';

import { getUsers, getRoles, assignRoles } from '../../../async/services/roleAssignmentService';

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
	const [selectedUserId, setSelectedUserId] = useState<string>('');
	const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [usersList, rolesList] = await Promise.all([getUsers(), getRoles()]);
				setUsers(usersList);
				setRoles(rolesList);
			} catch (err) {
				console.error('Error al cargar usuarios o roles:', err);
				alert('Error al cargar datos');
			}
		};

		fetchData();
	}, []);

	const handleAssignRoles = async () => {
		if (!selectedUserId) {
			alert('Por favor, selecciona un usuario.');
			return;
		}
		try {
			const updatedUser = await assignRoles(selectedUserId, selectedRoles);
			setUsers(prev => prev.map(u => (u._id === updatedUser._id ? updatedUser : u)));
			alert('Roles asignados correctamente');
		} catch (err) {
			console.error('Error al asignar roles:', err);
			alert('Error al asignar roles');
		}
	};

	return (
		<Container>
			<SectionTitle>Asignar Roles a Usuarios</SectionTitle>

			<SmartBox mb='px4'>
				<Autocomplete
					options={users}
					getOptionLabel={(u) => `${u.username} (${u.email})`}
					onChange={(e, value) => {
						if (value) {
							setSelectedUserId(value._id);
							setSelectedRoles(value.roles.map(r => r._id));
						} else {
							setSelectedUserId('');
							setSelectedRoles([]);
						}
					}}
					renderInput={(params) => (
						<TextField {...params} label="Seleccionar Usuario" variant="outlined" />
					)}
				/>
			</SmartBox>

			<SectionTitle  >Seleccionar Roles</SectionTitle>

			<SmartBox column gap="sm" mb='px4'>
				{roles.map(role => (
					<CheckboxContainer key={role._id}>
						<input
							type="checkbox"
							value={role._id}
							checked={selectedRoles.includes(role._id)}
							onChange={(e) => {
								const id = e.target.value;
								setSelectedRoles(prev =>
									prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
								);
							}}
						/>
						<ListItemText primary={role.name} />
					</CheckboxContainer>
				))}
			</SmartBox>

			<FilledButton
				colorType="primary"
				btnVariant="solid"
				onClick={handleAssignRoles}
				fullWidth
			>
				Asignar Roles
			</FilledButton>
		</Container>
	);
};

export default AssignRolesToUser;

