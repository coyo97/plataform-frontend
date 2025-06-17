import React, { useEffect, useState } from 'react';
import GroupIcon        from '@mui/icons-material/Group';
import PersonAddIcon    from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';

import FilledButton from '../../shared/atoms/buttons/filledButton/FilledButton';
import Text         from '../../shared/atoms/typography/Text';
import Loader       from '../../shared/atoms/feedback/loader/Loader';
import Alert        from '../../shared/atoms/feedback/alert/Alert';
import SmartBox     from '../../shared/atoms/box/SmartBox';

import {
	listGroups,
	listGroupMembers,
	addUserToGroup,
	removeUserFromGroup,
} from '../../../async/services/groupService';
import { listUsers } from '../../../async/services/userService';
import type { Group } from '../../../types/types';
import type { User  } from '../../../types/User';

import { Wrapper, Section, Row, ListBox, ListItemBox } from './groupUser.styles';

const GroupUser: React.FC = () => {
	const [groups, setGroups]             = useState<Group[]>([]);
	const [users, setUsers]               = useState<User[]>([]);
	const [members, setMembers]           = useState<User[]>([]);
	const [groupId, setGroupId]           = useState('');
	const [userToAdd, setUserToAdd]       = useState('');
	const [userToRemove, setUserToRemove] = useState('');
	const [loading, setLoading]           = useState(true);
	const [error, setError]               = useState<string | null>(null);
	const [message, setMessage]           = useState('');

	useEffect(() => {
		Promise.all([listGroups(), listUsers()])
		.then(([g, u]) => { setGroups(g); setUsers(u); })
		.catch(() => setError('No se pudieron cargar datos'))
		.finally(() => setLoading(false));
	}, []);

	useEffect(() => {
		if (!groupId) { setMembers([]); return; }
		listGroupMembers(groupId)
		.then(setMembers)
		.catch(() => setError('No se pudieron cargar los miembros'));
	}, [groupId]);

	const refreshMembers = () => groupId && listGroupMembers(groupId).then(setMembers);
	const resetFeedback  = () => { setError(null); setMessage(''); };

	const handleAdd = async (e: React.FormEvent) => {
		e.preventDefault(); resetFeedback();
		try {
			const { group } = await addUserToGroup(groupId, userToAdd);
			setMessage(`Usuario agregado a ${group.name}`);
			setUserToAdd('');
			refreshMembers();
		} catch { setError('Error al agregar usuario'); }
	};

	const handleRemove = async (e: React.FormEvent) => {
		e.preventDefault(); resetFeedback();
		try {
			const { group } = await removeUserFromGroup(groupId, userToRemove);
			setMessage(`Usuario eliminado de ${group.name}`);
			setUserToRemove('');
			refreshMembers();
		} catch { setError('Error al eliminar usuario'); }
	};

	return (
		<Wrapper>
			<Text as="h1" size="lg" weight="bold">
				<GroupIcon style={{ verticalAlign: 'text-bottom', marginRight: 6 }} />
				Gestión&nbsp;de&nbsp;Usuarios&nbsp;de&nbsp;Grupos
			</Text>

			{loading && <Loader />}
			{error   && <Alert type="error" onClose={() => setError(null)}>{error}</Alert>}
			{message && <Alert type="success" onClose={() => setMessage('')}>{message}</Alert>}

			{/* selector de grupo */}
			<Section>
				<Text weight="medium">Seleccionar grupo</Text>
				<select value={groupId} onChange={e => setGroupId(e.target.value)}>
					<option value="">-- Seleccione un grupo --</option>
					{groups.map(g => (
						<option key={g._id} value={g._id}>{g.name}</option>
					))}
				</select>
			</Section>

			{groupId && (
				<>
					{/* miembros */}
					<Section>
						<Row>
							<FilledButton onClick={refreshMembers} colorType="primary" startIcon={<GroupIcon />}>
								Ver miembros
							</FilledButton>
						</Row>

						{members.length > 0 && (
							<ListBox>
								<Text as="h3" weight="medium" style={{ padding: '4px 8px' }}>Miembros</Text>
								{members.map(m => (
									<ListItemBox key={m._id}>
										<Text size="sm">{m.username} ({m.email})</Text>
									</ListItemBox>
								))}
							</ListBox>
						)}
					</Section>

		  {/* agregar usuario */}
					<Section as="form" onSubmit={handleAdd}>
						<Text weight="medium">Agregar usuario</Text>
						<Row>
							<select
								value={userToAdd}
								onChange={e => setUserToAdd(e.target.value)}
								required
								style={{ flex: 1 }}
							>
								<option value="">-- Seleccione usuario --</option>
								{users.map(u => (
									<option key={u._id} value={u._id}>{u.username}</option>
								))}
							</select>
							<FilledButton type="submit" colorType="success" startIcon={<PersonAddIcon />}>
								Agregar
							</FilledButton>
						</Row>
					</Section>

					{/* eliminar usuario */}
					<Section as="form" onSubmit={handleRemove}>
						<Text weight="medium">Eliminar usuario</Text>
						<Row>
							<select
								value={userToRemove}
								onChange={e => setUserToRemove(e.target.value)}
								required
								style={{ flex: 1 }}
							>
								<option value="">-- Seleccione miembro --</option>
								{members.map(m => (
									<option key={m._id} value={m._id}>{m.username}</option>
								))}
							</select>
							<FilledButton type="submit" colorType="error" startIcon={<PersonRemoveIcon />}>
								Eliminar
							</FilledButton>
						</Row>
					</Section>
				</>
			)}
		</Wrapper>
	);
};

export default GroupUser;

