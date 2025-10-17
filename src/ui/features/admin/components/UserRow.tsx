import React from 'react';
import Text from '../../../shared/atoms/typography/Text';
import { StyledTableRow, StyledTableCell, ActionButtonContainer, ActionButton } from '../userManagement.styles';
import type { User } from '../UserManagement';

interface Props {
	user: User;
	onDeactivate: (id: string) => void;
	onReactivate: (id: string) => void;
	onBlacklist: (id: string) => void;
	onDelete: (id: string) => void;
}

export const UserRow: React.FC<Props> = ({ user, onDeactivate, onReactivate, onBlacklist, onDelete }) => {
	return (
		<StyledTableRow>
			<StyledTableCell>
				<Text as="span" weight="medium">{user.username}</Text>
			</StyledTableCell>

			<StyledTableCell>
				<Text as="span" size="sm" colorKey="text.secondary">{user.email}</Text>
			</StyledTableCell>

			<StyledTableCell>
				<Text as="span" size="sm" colorKey="text.secondary">
					{user.roles?.length ? user.roles.map((r) => r.name).join(', ') : 'Sin roles'}
				</Text>
			</StyledTableCell>

			<StyledTableCell>
				<Text as="span" size="sm" colorKey="text.secondary" sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
					{Array.isArray(user.careers) && user.careers.length
						? (user.careers as any[]).map((c) => (typeof c === 'string' ? c : c.name)).join(', ')
						: 'Sin carrera'}
				</Text>
			</StyledTableCell>

			<StyledTableCell>
				{user.status === 'blacklisted' && (
					<Text as="span" size="sm" weight="medium" colorKey="error.main">Bloqueado</Text>
				)}
				{user.status === 'active' && (
					<Text as="span" size="sm" colorKey="success.main">activo</Text>
				)}
				{user.status === 'deactivated' && (
					<Text as="span" size="sm" colorKey="warning.main">desactivado</Text>
				)}
				{!user.status && (
					<Text as="span" size="sm" colorKey="text.secondary">Sin estado</Text>
				)}
			</StyledTableCell>

			<StyledTableCell align="right">
				<Text as="span" size="sm" weight="medium" sx={{ fontVariantNumeric: 'tabular-nums' }}>
					{user.reportCount}
				</Text>
			</StyledTableCell>

			<StyledTableCell>
				<ActionButtonContainer>
					{user.status === 'active' && (
						<>
							<ActionButton onClick={() => onDeactivate(user._id)}>
								<Text as="span" size="sm" weight="medium">Desactivar</Text>
							</ActionButton>
							<ActionButton onClick={() => onBlacklist(user._id)}>
								<Text as="span" size="sm" weight="medium">Bloquear</Text>
							</ActionButton>
						</>
					)}

					{user.status === 'deactivated' && (
						<>
							<ActionButton onClick={() => onReactivate(user._id)}>
								<Text as="span" size="sm" weight="medium">Reactivar</Text>
							</ActionButton>
							<ActionButton onClick={() => onBlacklist(user._id)}>
								<Text as="span" size="sm" weight="medium">Bloquear</Text>
							</ActionButton>
							<ActionButton onClick={() => onDelete(user._id)}>
								<Text as="span" size="sm" weight="medium">Eliminar</Text>
							</ActionButton>
						</>
					)}

					{user.status === 'blacklisted' && (
						<>
							<Text as="span" size="sm" colorKey="error.main" weight="medium" sx={{ mr: 1 }}>
								Usuario bloqueado
							</Text>
							<ActionButton onClick={() => onDelete(user._id)}>
								<Text as="span" size="sm" weight="medium">Eliminar</Text>
							</ActionButton>
							<ActionButton onClick={() => onReactivate(user._id)}>
								<Text as="span" size="sm" weight="medium">Reactivar</Text>
							</ActionButton>
						</>
					)}
				</ActionButtonContainer>
			</StyledTableCell>
		</StyledTableRow>
	);
};
