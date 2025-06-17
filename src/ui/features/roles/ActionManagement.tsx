import React, { useState, useEffect } from 'react';
import {
	fetchActions,
	createAction,
	updateAction,
	deleteAction,
	Action,
} from '../../../async/services/actionService';

import MainInput from '../../shared/atoms/inputs/MainInput';
import FilledButton from '../../shared/atoms/buttons/filledButton/FilledButton';
import GhostButton from '../../shared/atoms/buttons/ghostButton/GhostButton';
import SmartBox from '../../shared/atoms/box/SmartBox';
import Text from '../../shared/atoms/typography/Text';
import { useTheme, useMediaQuery } from '@mui/material'; 

const ActionManagement: React.FC = () => {
	const [actions, setActions] = useState<Action[]>([]);
	const [newName, setNewName] = useState('');
	const [editing, setEditing] = useState<Action | null>(null);
	const [editName, setEditName] = useState('');

	const theme = useTheme();                          
	const isDesktop = useMediaQuery(theme.breakpoints.up('sm')); 

	useEffect(() => {
		fetchActions()
		.then(setActions)
		.catch(err => console.error('Error al obtener acciones', err));
	}, []);

	const handleCreate = async () => {
		if (!newName.trim()) return alert('Nombre vacío');
		try {
			const action = await createAction(newName.trim());
			setActions(prev => [...prev, action]);
			setNewName('');
		} catch {
			alert('Error al crear acción');
		}
	};

	const startEdit = (a: Action) => {
		setEditing(a);
		setEditName(a.name);
	};

	const cancelEdit = () => {
		setEditing(null);
		setEditName('');
	};

	const handleUpdate = async () => {
		if (!editing || !editName.trim()) return alert('Nombre vacío');
		try {
			const action = await updateAction(editing._id, editName.trim());
			setActions(prev => prev.map(a => (a._id === action._id ? action : a)));
			cancelEdit();
		} catch {
			alert('Error al actualizar acción');
		}
	};

	const handleDelete = async (id: string) => {
		if (!window.confirm('¿Eliminar esta acción?')) return;
		try {
			await deleteAction(id);
			setActions(prev => prev.filter(a => a._id !== id));
		} catch {
			alert('Error al eliminar acción');
		}
	};

	return (
		<SmartBox column gap={3} p='px2' radius="md" shadow="md" sx={{ maxWidth: '800px', margin: '0 auto' }}>

			{isDesktop ? (
				<SmartBox column between gap={2}>
					<MainInput
						label='Nombre de la Accion'
						value={newName}
						onChange={setNewName}
						placeholder="Nombre de la Acción"
					/>
					<FilledButton onClick={handleCreate}>Crear Acción</FilledButton>
				</SmartBox>
			) : (
				<SmartBox
					sx={{
						display: 'flex',
						flexDirection: 'column',
						gap: 1,
						alignItems: 'stretch',
						'& > *:first-of-type': { flex: 1 },
					'& > button': {
						width: '100%',
						py: 1,
					},
					}}
				>
					<MainInput
						label='Nombre de la Accion'
						value={newName}
						onChange={setNewName}
						placeholder="Nombre de la Acción"
					/>
					<FilledButton onClick={handleCreate}>Crear Acción</FilledButton>
				</SmartBox>
			)}

			<ul style={{ listStyle: 'none', padding: 0, margin: 0, width: '100%' }}>
				{actions.map(a => (
					<li key={a._id}>
						<SmartBox
							column={{ xs: true, sm: false }}
							between
							alignItems="center"
							p='px2'
							sx={{ borderBottom: '1px solid #E0E2E7', gap: '1rem' }}
						>
							{editing && editing._id === a._id ? (
								<>
									<MainInput
										label='Editar nombre'
										value={editName}
										onChange={setEditName}
										placeholder="Editar nombre"
									/>
									<SmartBox row gap={1}>
										<FilledButton onClick={handleUpdate}>Guardar</FilledButton>
										<GhostButton label="Cancelar" onClick={cancelEdit} />
									</SmartBox>
								</>
							) : (
								<>
									<Text size="md" weight="regular">{a.name}</Text>
									<SmartBox row gap={1}>
										<FilledButton onClick={() => startEdit(a)}>Editar</FilledButton>
										<GhostButton label="Eliminar" onClick={() => handleDelete(a._id)} />
									</SmartBox>
								</>
							)}
						</SmartBox>
					</li>
				))}
			</ul>
		</SmartBox>
	);
};

export default ActionManagement;

