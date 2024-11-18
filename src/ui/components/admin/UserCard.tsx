// src/ui/components/admin/UserCard.tsx

import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { ActionButtonContainer, ActionButton } from './userManagement.styles';

interface Role {
	_id: string;
	name: string;
}

interface Career {
	_id: string;
	name: string;
}

interface User {
	_id: string;
	username: string;
	email: string;
	careers?: Career[]; // Array opcional de Career
	roles?: Role[];
	status: string;
	reportCount: number;
}


interface UserCardProps {
	user: User;
	handleDeactivate: (userId: string) => void;
	handleReactivate: (userId: string) => void;
	handleBlacklist: (userId: string) => void;
	handleDelete: (userId: string) => void;
}

const UserCard: React.FC<UserCardProps> = ({
	user,
	handleDeactivate,
	handleReactivate,
	handleBlacklist,
	handleDelete,
}) => {
	return (
		<Card style={{ marginBottom: '10px' }}>
			<CardContent>
				<Typography variant="h6">{user.username}</Typography>
				<Typography variant="body2">Email: {user.email}</Typography>
				<Typography variant="body2">
					Roles: {user.roles && user.roles.length > 0
						? user.roles.map((role: Role) => role.name).join(', ')
						: 'Sin roles'}
				</Typography>
				<Typography variant="body2">
					Carreras: {user.careers && user.careers.length > 0
						? user.careers.map((career: Career) => career.name).join(', ')
						: 'Sin carrera'}
				</Typography>
				<Typography variant="body2">Estado: {user.status || 'Sin estado'}</Typography>
				<Typography variant="body2">Reportes: {user.reportCount}</Typography>
				{/* Botones de acción */}
				<ActionButtonContainer>
					{/* Botones según el estado del usuario */}
					{user.status === 'active' && (
						<>
							<ActionButton onClick={() => handleDeactivate(user._id)}>Desactivar</ActionButton>
							<ActionButton onClick={() => handleBlacklist(user._id)}>Bloquear</ActionButton>
						</>
					)}
					{user.status === 'deactivated' && (
						<>
							<ActionButton onClick={() => handleReactivate(user._id)}>Reactivar</ActionButton>
							<ActionButton onClick={() => handleBlacklist(user._id)}>Bloquear</ActionButton>
							<ActionButton onClick={() => handleDelete(user._id)}>Eliminar</ActionButton>
						</>
					)}
					{user.status === 'blacklisted' && (
						<>
							<Typography variant="body2" color="error">Usuario bloqueado</Typography>
							<ActionButton onClick={() => handleDelete(user._id)}>Eliminar</ActionButton>
							<ActionButton onClick={() => handleReactivate(user._id)}>Reactivar</ActionButton>
						</>
					)}
				</ActionButtonContainer>
			</CardContent>
		</Card>
	);
};

export default UserCard;

