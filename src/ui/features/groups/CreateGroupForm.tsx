import React, { useState } from 'react';
import MainInput     from '../../shared/atoms/inputs/MainInput';
import FilledButton  from '../../shared/atoms/buttons/filledButton/FilledButton';
import Text          from '../../shared/atoms/typography/Text';
import SmartBox      from '../../shared/atoms/box/SmartBox';
import type { Group } from '../../../types/types';


import { createGroup } from '../../../async/services/groupService';

interface Props {
	onSuccess?: () => void;
}

const CreateGroupForm: React.FC<Props> = ({ onSuccess }) => {
	const [name, setName]         = useState('');
	const [sending, setSending]   = useState(false);
	const [error, setError]       = useState<string | null>(null);

	const [groupName, setGroupName]   = useState('');
	const [groups, setGroups]         = useState<Group[]>([]);
	const [description, setDescription] = useState('');




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

	return (
		<SmartBox column gap="px4">
			<MainInput
				label='Nombre del grupo'
				placeholder='Nombre del grupo'
				value={groupName}
				onChange={setGroupName}
			/>
			<MainInput
				placeholder='Descripción del grupo'
				label="Descripción del grupo"
				value={description}
				multiline
				minRows={2}
				onChange={setDescription}
			/>
			<FilledButton
				fullWidth
				colorType="primary"
				disabled={!groupName.trim()}
				onClick={handleCreate}
			>
				Crear grupo
			</FilledButton>
		</SmartBox>

	);
};

export default CreateGroupForm;

