import React, { useEffect, useState } from 'react';

import SmartBox      from '../../shared/atoms/box/SmartBox';
import Text          from '../../shared/atoms/typography/Text';
import MainInput     from '../../shared/atoms/inputs/MainInput';
import FilledButton  from '../../shared/atoms/buttons/filledButton/FilledButton';
import Loader        from '../../shared/atoms/feedback/loader/Loader';
import Alert         from '../../shared/atoms/feedback/alert/Alert';

import {
	listGroups,
	createGroup,
	joinGroup,
} from '../../../async/services/groupService';
import type { Group } from '../../../types/types';

import { GroupContainer, GroupList, GroupItem } from './groupManager.styles';

const GroupManager: React.FC = () => {
	/* ----- estado ----- */
	const [groups, setGroups]         = useState<Group[]>([]);
	const [groupName, setGroupName]   = useState('');
	const [description, setDescription] = useState('');
	const [loading, setLoading]       = useState(true);
	const [error, setError]           = useState<string | null>(null);

	useEffect(() => {
		listGroups()
		.then(setGroups)
		.catch(() => setError('No se pudieron cargar los grupos'))
		.finally(() => setLoading(false));
	}, []);

	const handleCreate = async () => {
		if (!groupName.trim()) return;
		try {
			const { group } = await createGroup(groupName.trim(), description.trim());
			setGroups(prev => [...prev, group]);
			setGroupName('');
			setDescription('');
		} catch {
			setError('Error creando el grupo');
		}
	};

	const handleJoin = async (id: string) => {
		try {
			await joinGroup(id);
			alert('✅ Te uniste al grupo');
		} catch {
			setError('No se pudo unir al grupo');
		}
	};

	return (
		<GroupContainer>
			<Text as="h1" size="lg" weight="bold">
				Gestión&nbsp;de&nbsp;Grupos
			</Text>

			{/* feedback de carga / error */}
			{loading && <Loader />}
			{error && <Alert type="error" onClose={() => setError(null)}>{error}</Alert>}

			{/* lista de grupos */}
			{!loading && !error && (
				<GroupList>
					{groups.map(g => (
						<GroupItem key={g._id}>
							<Text weight="medium">{g.name}</Text>
							<FilledButton
								variant="text"
								colorType="secondary"
								onClick={() => handleJoin(g._id)}
							>
								Unirse
							</FilledButton>
						</GroupItem>
					))}
				</GroupList>
			)}
		</GroupContainer>
	);
};

export default GroupManager;
