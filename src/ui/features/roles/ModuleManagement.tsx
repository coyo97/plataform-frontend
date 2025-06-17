import React, { useState, useEffect } from 'react';
import {
	fetchModules,
	createModule,
	updateModule,
	deleteModule,
	Module,
} from '../../../async/services/moduleService';

import SectionTitle from '../../shared/atoms/titles/SectionTitle';
import MainInput from '../../shared/atoms/inputs/MainInput';
import FilledButton from '../../shared/atoms/buttons/filledButton/FilledButton';
import GhostButton from '../../shared/atoms/buttons/ghostButton/GhostButton';
import SmartBox from '../../shared/atoms/box/SmartBox';
import Text from '../../shared/atoms/typography/Text';
import { useTheme, useMediaQuery } from '@mui/material';

const ModuleManagement: React.FC = () => {
	const [modules, setModules]      = useState<Module[]>([]);
	const [newName, setNewName]      = useState('');
	const [editing, setEditing]      = useState<Module | null>(null);
	const [editingName, setEditName] = useState('');

	const theme = useTheme();
	const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));

	useEffect(() => {
		fetchModules()
		.then(setModules)
		.catch(err => console.error('Error al obtener módulos', err));
	}, []);

	const handleCreate = async () => {
		if (!newName.trim()) return alert('Nombre vacío');
		try {
			const module = await createModule(newName.trim());
			setModules(prev => [...prev, module]);
			setNewName('');
		} catch {
			alert('Error al crear módulo');
		}
	};

	const startEdit = (m: Module) => {
		setEditing(m);
		setEditName(m.name);
	};

	const cancelEdit = () => {
		setEditing(null);
		setEditName('');
	};

	const handleUpdate = async () => {
		if (!editing || !editingName.trim()) return alert('Nombre vacío');
		try {
			const module = await updateModule(editing._id, editingName.trim());
			setModules(prev => prev.map(m => (m._id === module._id ? module : m)));
			cancelEdit();
		} catch {
			alert('Error al actualizar módulo');
		}
	};

	const handleDelete = async (id: string) => {
		if (!window.confirm('¿Eliminar módulo?')) return;
		try {
			await deleteModule(id);
			setModules(prev => prev.filter(m => m._id !== id));
		} catch {
			alert('Error al eliminar módulo');
		}
	};

	return (
		<SmartBox column gap={3} p='px2' radius="md" shadow="md" sx={{ maxWidth: '800px', margin: '0 auto' }}>

			{isDesktop ? (
				<SmartBox column between gap={2}>
					<MainInput
						label="Nombre del Módulo"
						value={newName}
						onChange={setNewName}
						placeholder="Nombre del Módulo"
					/>
					<FilledButton onClick={handleCreate}>Crear Módulo</FilledButton>
				</SmartBox>
			) : (
				<SmartBox
					sx={{
						display: 'flex',
						flexDirection: { xxs: 'column', sm: 'row' },
					gap: 1,
					alignItems: 'stretch',
					'& > *:first-of-type': { flex: 1 },
					'& > button': {
						width: { xxs: '100%', sm: 'auto' },
					maxWidth: { sm: 200 },
					py: 1,
					},
					}}
				>
					<MainInput
						label="Nombre del Módulo"
						value={newName}
						onChange={setNewName}
						placeholder="Nombre del Módulo"
					/>
					<FilledButton onClick={handleCreate}>Crear Módulo</FilledButton>
				</SmartBox>
			)}

			<Text size="lg" weight="medium">Lista de Módulos</Text>
			<ul style={{ listStyle: 'none', padding: 0, margin: 0, width: '100%' }}>
				{modules.map(m => (
					<li key={m._id}>
						<SmartBox
							sx={{
								display: 'flex',
								flexDirection: { xxs: 'column', sm: 'row' },
							justifyContent: 'space-between',
							alignItems: { xxs: 'flex-start', sm: 'center' },
							gap: { xxs: 1, sm: 2 },
							padding: { xxs: 1, sm: 2 },
							borderBottom: '1px solid #E0E2E7',
							}}
						>
							{editing && editing._id === m._id ? (
								<SmartBox column gap={2} sx={{ width: '100%' }}>
									<MainInput
										label="Nombre del Módulo"
										value={editingName}
										onChange={setEditName}
										placeholder="Editar nombre del módulo"
									/>
									<SmartBox
										sx={{
											display: 'flex',
											flexDirection: { xxs: 'column', sm: 'row' },
										gap: 1,
										width: '100%',
										'& button': {
											width: { xxs: '100%', sm: 'auto' },
										py: 1,
										},
										}}
									>
										<FilledButton onClick={handleUpdate}>Guardar</FilledButton>
										<GhostButton label="Cancelar" onClick={cancelEdit} />
									</SmartBox>
								</SmartBox>
							) : (
								<SmartBox
									sx={{
										display: 'flex',
										flexDirection: { xxs: 'column', sm: 'row' },
									alignItems: { xxs: 'flex-start', sm: 'center' },
									gap: 1,
									width: '100%',
									'& > :first-of-type': { flex: 1 },
									}}
								>
									<Text size="md">{m.name}</Text>
									<SmartBox
										sx={{
											display: 'flex',
											flexDirection: { xxs: 'column', xs: 'row' },
										gap: 1,
										'& button': {
											width: { xxs: '100%', xs: '50%', sm: 'auto' },
										minWidth: 90,
										py: 1,
										},
										}}
									>
										<FilledButton onClick={() => startEdit(m)}>Editar</FilledButton>
										<GhostButton label="Eliminar" onClick={() => handleDelete(m._id)} />
									</SmartBox>
								</SmartBox>
							)}
						</SmartBox>
					</li>
				))}
			</ul>
		</SmartBox>
	);
};

export default ModuleManagement;

