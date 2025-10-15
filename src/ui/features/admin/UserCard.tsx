// src/ui/components/admin/UserCard.tsx
import React from 'react';
import { Card, CardContent, Box, Chip, Checkbox } from '@mui/material';
import { ActionButtonContainer, ActionButton } from './userManagement.styles';
import Text from '../../shared/atoms/typography/Text';

interface Role {
	_id: string;
	name: string;
}

interface Career {
	_id: string;
	name?: string;
	facultyId?: string | { _id: string };
}

interface FacultyLite {
	_id: string;
	name?: string;
}

interface User {
	_id: string;
	username: string;
	email: string;
	careers?: Array<Career | string | { _id: string; name?: string }>;
	facultyId?: string | FacultyLite;
	roles?: Role[];
	status: 'active' | 'deactivated' | 'blacklisted' | string;
	reportCount: number;
}

interface UserCardProps {
	user: User;
	handleDeactivate: (userId: string) => void;
	handleReactivate: (userId: string) => void;
	handleBlacklist: (userId: string) => void;
	handleDelete: (userId: string) => void;

	/** NUEVO (opcional): permitir selección (por ejemplo, para acciones masivas en móvil) */
	selectable?: boolean;
	selected?: boolean;
	onToggleSelect?: (userId: string, next: boolean) => void;

	/** NUEVO (opcional): mostrar facultad si existe */
	showFaculty?: boolean;
}

const getCareerNames = (careers?: User['careers']) => {
	if (!careers || careers.length === 0) return [];
	return careers
	.map((c) => {
		if (typeof c === 'string') return c;          // id como string (fallback)
		if (!c) return '';
		return c.name ?? c._id;                       // usa nombre si hay, si no id
	})
	.filter(Boolean);
};

const getFacultyName = (facultyId?: User['facultyId']) => {
	if (!facultyId) return '';
	if (typeof facultyId === 'string') return facultyId;      // fallback (id)
	return facultyId.name ?? facultyId._id ?? '';
};

const StatusBadge: React.FC<{ status: User['status'] }> = ({ status }) => {
	if (status === 'blacklisted') {
		return <Chip size="small" label="Bloqueado" color="error" />;
	}
	if (status === 'deactivated') {
		return <Chip size="small" label="Desactivado" color="warning" />;
	}
	if (status === 'active') {
		return <Chip size="small" label="Activo" color="success" />;
	}
	return <Chip size="small" label="Sin estado" variant="outlined" />;
};

const UserCard: React.FC<UserCardProps> = ({
	user,
	handleDeactivate,
	handleReactivate,
	handleBlacklist,
	handleDelete,
	selectable,
	selected,
	onToggleSelect,
	showFaculty = true,
}) => {
	const careerNames = getCareerNames(user.careers);
	const facultyName = showFaculty ? getFacultyName(user.facultyId) : '';

	return (
		<Card style={{ marginBottom: '10px' }}>
			<CardContent>
				{/* Cabecera: [checkbox opcional] nombre + estado */}
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
					{selectable && (
						<Checkbox
							checked={!!selected}
							onChange={(e) => onToggleSelect?.(user._id, e.target.checked)}
							inputProps={{ 'aria-label': `Seleccionar ${user.username}` }}
							size="small"
						/>
					)}
					<Text as="h3" headingLevel="h3" system="italic" weight="bold" colorKey="text.primary" sx={{ mr: 1 }}>
						{user.username}
					</Text>
					<StatusBadge status={user.status} />
				</Box>

				{/* Email */}
				<Text size="sm" colorKey="text.secondary" sx={{ mb: 0.5 }}>
					<Text as="span" weight="medium">Email: </Text>{user.email}
				</Text>

				{/* Facultad (opcional) */}
				{showFaculty && (
					<Text size="sm" colorKey="text.secondary" sx={{ mb: 0.5 }}>
						<Text as="span" weight="medium">Facultad: </Text>
						{facultyName || '—'}
					</Text>
				)}

				{/* Roles */}
				<Text size="sm" colorKey="text.secondary" sx={{ mb: 0.5 }}>
					<Text as="span" weight="medium">Roles: </Text>
					{user.roles && user.roles.length > 0
						? user.roles.map((role: Role) => role.name).join(', ')
						: 'Sin roles'}
				</Text>

				{/* Carreras (chips si hay, si no texto) */}
				<Box sx={{ mb: 0.5 }}>
					<Text as="span" size="sm" colorKey="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
						<Text as="span" weight="medium">Carreras: </Text>
					</Text>
					{careerNames.length > 0 ? (
						<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
							{careerNames.map((name, idx) => (
								<Chip key={`${user._id}-career-${idx}`} size="small" label={name} variant="outlined" />
							))}
						</Box>
					) : (
						<Text size="sm" colorKey="text.secondary">Sin carrera</Text>
					)}
				</Box>

				{/* Reportes */}
				<Text size="sm" colorKey="text.secondary" sx={{ mb: 1 }}>
					<Text as="span" weight="medium">Reportes: </Text>
					<Box component="span" sx={{ fontVariantNumeric: 'tabular-nums' }}>
						{Number.isFinite(user.reportCount) ? user.reportCount : 0}
					</Box>
				</Text>

				{/* Botones de acción */}
				<ActionButtonContainer>
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
							<Text size="sm" colorKey="error.main" weight="medium" sx={{ mr: 1 }}>
								Usuario bloqueado
							</Text>
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

