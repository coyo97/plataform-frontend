import React, { useState, useEffect, useMemo } from 'react';
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
	Divider,
	LinearProgress,
	Chip,
	Box,
} from '@mui/material';

import { getUsers, getRoles, assignRoles } from '../../../async/services/roleAssignmentService';
import { fetchFaculties, fetchCareers } from '../../../async/services/careerService';

// ===== Tipos (sin cambios de lógica)
interface User {
	_id: string;
	username: string;
	email: string;
	roles: any[];
	facultyId?: string | { _id: string };
	careers?: Array<string | { _id: string; name?: string }>;
}
interface Role { _id: string; name: string }
interface Faculty { _id: string; name: string }
interface Career  { _id: string; name: string; facultyId?: string | { _id: string } }

const AssignRolesToUser: React.FC = () => {
	// ===== Estado — LÓGICA EXISTENTE (no tocada)
	const [users, setUsers] = useState<User[]>([]);
	const [roles, setRoles] = useState<Role[]>([]);
	const [selectedUserId, setSelectedUserId] = useState<string>('');
	const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

	// ===== NUEVO: filtros visuales por facultad/carrera (UI)
	const [faculties, setFaculties] = useState<Faculty[]>([]);
	const [careers, setCareers] = useState<Career[]>([]);
	const [facultyId, setFacultyId] = useState<string>('');
	// Carreras seleccionadas (autoselect all when picking a faculty; permite excluir)
	const [selectedCareerIds, setSelectedCareerIds] = useState<string[]>([]);

	// ===== NUEVO: selección múltiple para asignación masiva (UI)
	const [bulkSelectedUserIds, setBulkSelectedUserIds] = useState<string[]>([]);
	const [bulkLoading, setBulkLoading] = useState(false);
	const [progress, setProgress] = useState<{ done: number; total: number; fails: number }>({ done: 0, total: 0, fails: 0 });

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [[usersList, rolesList], facs, cars] = await Promise.all([
					Promise.all([getUsers(), getRoles()]),
					fetchFaculties().catch(() => [] as Faculty[]),
					fetchCareers().catch(() => [] as Career[]),
				]);
				setUsers(usersList);
				setRoles(rolesList);
				setFaculties(Array.isArray(facs) ? facs : []);
				setCareers(Array.isArray(cars) ? cars : []);
			} catch (err) {
				console.error('Error al cargar datos:', err);
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

	// ===== Helpers para normalizar campos =====
	const normalizedFacultyId = (u: User) =>
		typeof u.facultyId === 'string' ? u.facultyId : (u.facultyId?._id ?? undefined);

	const normalizedCareerIds = (u: User) =>
		(u.careers ?? [])
	.map(c => (typeof c === 'string' ? c : (c?._id ?? '')))
	.filter(Boolean);

	// Carreras disponibles para el selector (limitadas por facultad si aplica)
	const careerOptionsForFaculty = useMemo(() => {
		if (!facultyId) return careers;
		return careers.filter(c => {
			const cf = typeof c.facultyId === 'string' ? c.facultyId : (c.facultyId as any)?._id;
			return cf === facultyId;
		});
	}, [careers, facultyId]);

	// Al cambiar Facultad: autoseleccionar TODAS sus carreras (permite luego excluir)
	useEffect(() => {
		if (!facultyId) return;
		const inFaculty = careerOptionsForFaculty.map(c => c._id);
		setSelectedCareerIds(inFaculty);
	}, [facultyId, careerOptionsForFaculty]);

	// ¿El usuario pertenece a la facultad (por facultyId directo o por carreras)?
	const userBelongsToFaculty = (u: User, facId: string) => {
		const fId = normalizedFacultyId(u);
		if (fId && fId === facId) return true;

		// derivar pertenencia por carreras
		const uCareerIds = normalizedCareerIds(u);
		if (uCareerIds.length === 0) return false;

		const facultyCareerIds = careers
		.filter(c => {
			const cf = typeof c.facultyId === 'string' ? c.facultyId : (c.facultyId as any)?._id;
			return cf === facId;
		})
		.map(c => c._id);

		const setFac = new Set(facultyCareerIds);
		return uCareerIds.some(cid => setFac.has(cid));
	};

	// ===== Filtrado final (reglas UX correctas)
	const filteredUsers = useMemo(() => {
		// Sin filtros => todos
		if (!facultyId && selectedCareerIds.length === 0) return users;

		return users.filter(u => {
			const uCareerIds = normalizedCareerIds(u);
			const hasCareers = uCareerIds.length > 0;

			if (facultyId) {
				// incluir usuarios sin carreras pero con facultyId igual
				if (!hasCareers) return normalizedFacultyId(u) === facultyId;

				// Si hay carreras seleccionadas (autoselect all por default), intersectar
				const allowByCareer = uCareerIds.some(cid => selectedCareerIds.includes(cid));
				if (allowByCareer) return true;

				// fallback: si no intersecta pero el user pertenece a la facultad por facultyId directo o por sus carreras
				return userBelongsToFaculty(u, facultyId);
			}

			// Sin Facultad, pero con carreras seleccionadas (global)
			if (selectedCareerIds.length > 0) {
				if (!hasCareers) return false;
				return uCareerIds.some(cid => selectedCareerIds.includes(cid));
			}

			return true;
		});
	}, [users, facultyId, selectedCareerIds, careers]);

	// ===== Asignación masiva (usa tu misma lógica assignRoles, sin tocarla)
	const handleAssignRolesBulk = async () => {
		if (bulkSelectedUserIds.length === 0) {
			alert('No hay usuarios seleccionados.');
			return;
		}
		if (selectedRoles.length === 0) {
			alert('Selecciona al menos un rol antes de asignar.');
			return;
		}
		setBulkLoading(true);
		setProgress({ done: 0, total: bulkSelectedUserIds.length, fails: 0 });
		try {
			const batchSize = 25;
			for (let i = 0; i < bulkSelectedUserIds.length; i += batchSize) {
				const slice = bulkSelectedUserIds.slice(i, i + batchSize);
				const results = await Promise.allSettled(
					slice.map(id => assignRoles(id, selectedRoles))
				);
				let ok = 0, fail = 0;
				results.forEach(r => (r.status === 'fulfilled' ? ok++ : fail++));
				setProgress(prev => ({ done: prev.done + ok + fail, total: prev.total, fails: prev.fails + fail }));
				// (Opcional) actualizar users en memoria si tu API retorna el user actualizado
			}
			alert(`Asignación completada: ${progress.done}/${progress.total} procesados, errores: ${progress.fails}`);
		} catch (e) {
			console.error(e);
			alert('Error en la asignación masiva');
		} finally {
			setBulkLoading(false);
		}
	};

	return (
		<Container>
			{/* ===== Título principal */}
			<SmartBox mb="px4">
				<SectionTitle>Asignar Roles a Usuarios</SectionTitle>
			</SmartBox>

			{/* ===== Autocomplete Usuario (individual) */}
			<SmartBox column p="px8" mb="px1" radius="sm3x" shadow="sm" sx={{ backgroundColor: 'background.paper' }}>
				<Text headingLevel="h3" system="sans" sx={{ mb: 1 }}>Usuario</Text>

				<Autocomplete
					options={users}
					value={users.find(u => u._id === selectedUserId) ?? null}
					onChange={(_, value) => {
						if (value) {
							setSelectedUserId(value._id);
							setSelectedRoles((value.roles ?? []).map((r: any) => r._id));
						} else {
							setSelectedUserId('');
							setSelectedRoles([]);
						}
					}}
					isOptionEqualToValue={(opt, val) => opt._id === val._id}
					getOptionLabel={(u) => (u ? `${u.username} (${u.email})` : '')}
					renderInput={(params) => (
						<TextField {...params} label="Seleccionar Usuario" variant="outlined" />
					)}
				/>
			</SmartBox>

			{/* ===== Selector de Roles (mismo para individual y masivo) */}
			<SmartBox column p="px4" mb="px1" radius="sm2x" shadow="sm" sx={{ backgroundColor: 'background.paper' }}>
				<Text headingLevel="h3" system="sans" sx={{ mb: 1 }}>Seleccionar Roles</Text>

				<SmartBox column sx={{ gap: 8 /* px */ }}>
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

				<SmartBox mt="px1">
					<FilledButton
						colorType="primary"
						btnVariant="solid"
						onClick={handleAssignRoles}
						fullWidth
					>
						Asignar Roles (usuario seleccionado)
					</FilledButton>
				</SmartBox>
			</SmartBox>

			<Divider />

			{/* ===== Asignación masiva por Facultad/Carrera */}
			<SmartBox mt="px2" mb="px2">
				<Text displayLevel="lg" system="sans" weight="medium">Asignación masiva por Facultad o Carrera</Text>
			</SmartBox>

			<Text size="sm" colorKey="text.secondary" sx={{ mb: 2 }}>
				Elige una Facultad para autoseleccionar sus Carreras (puedes excluir algunas) y asigna los <b>mismos roles seleccionados arriba</b>.
			</Text>

			{/* Filtros (en cliente) */}
			<SmartBox row between p="px1" mb="px1" radius="sm4x" shadow="xs" sx={{ backgroundColor: 'background.paper', gap: 12 }}>
				{/* Facultad */}
				<Autocomplete
					sx={{ flex: 1, minWidth: 260 }}
					options={[{ _id: '', name: '— Todas las Facultades —' }, ...faculties]}
					value={faculties.find(f => f._id === facultyId) ?? { _id: '', name: '— Todas las Facultades —' }}
					onChange={(_, val) => {
						const id = (val as Faculty | null)?._id ?? '';
						setFacultyId(id);
						// NOTA: selectedCareerIds se setea automáticamente en el useEffect
					}}
					isOptionEqualToValue={(a, b) => a._id === b._id}
					getOptionLabel={(f) => f?.name ?? ''}
					renderInput={(p) => <TextField {...p} label="Filtrar por Facultad" />}
				/>

				{/* Carreras (multiple) — limitadas por facultad si aplica */}
				<Autocomplete
					multiple
					disableCloseOnSelect
					sx={{ flex: 1, minWidth: 260 }}
					options={facultyId ? careerOptionsForFaculty : careers}
					value={(facultyId ? careerOptionsForFaculty : careers).filter(c => selectedCareerIds.includes(c._id))}
					onChange={(_, vals) => setSelectedCareerIds(vals.map(v => v._id))}
					isOptionEqualToValue={(a, b) => a._id === b._id}
					getOptionLabel={(c) => c?.name ?? ''}
					renderInput={(p) => <TextField {...p} label={facultyId ? 'Carreras (de esta facultad)' : 'Carreras'} />}
					renderOption={(props, option, { selected }) => (
						<li {...props}>
							<input type="checkbox" checked={selected} readOnly style={{ marginRight: 8 }} />
							{option.name}
						</li>
					)}
				/>
			</SmartBox>

			{facultyId && (
				<SmartBox row sx={{ gap: 8 }} mt="px1" mb="px2">
					<FilledButton
						btnVariant="outline"
						onClick={() => setSelectedCareerIds(careerOptionsForFaculty.map(c => c._id))}
					>
						Marcar todas las carreras
					</FilledButton>
					<FilledButton
						btnVariant="outline"
						onClick={() => setSelectedCareerIds([])}
					>
						Desmarcar todas
					</FilledButton>
				</SmartBox>
			)}

			{/* Multi-selección de usuarios filtrados */}
			<SmartBox column p="px1" mb="px1" radius="sm3x" shadow="xs" sx={{ backgroundColor: 'background.paper' }}>
				<Text headingLevel="h3" system="sans" sx={{ mb: 1 }}>
					Usuarios filtrados ({filteredUsers.length})
				</Text>

				<Autocomplete
					multiple
					options={filteredUsers}
					value={filteredUsers.filter(u => bulkSelectedUserIds.includes(u._id))}
					onChange={(_, values) => setBulkSelectedUserIds(values.map(v => v._id))}
					isOptionEqualToValue={(opt, val) => opt._id === val._id}
					disableCloseOnSelect
					getOptionLabel={(u) => `${u.username} (${u.email})`}
					renderTags={(value, getTagProps) =>
						value.map((option, index) => (
							<Chip {...getTagProps({ index })} key={option._id} label={option.username} />
					))
					}
					renderInput={(params) => (
						<TextField
							{...params}
							label="Selecciona uno o varios usuarios"
							helperText="Puedes tipear para filtrar rápidamente"
						/>
					)}
				/>

				{/* Resumen + Progreso */}
				<SmartBox mt="px2" column sx={{ gap: 6 }}>
					<Box>
						<Text size="sm"><b>Seleccionados:</b> {bulkSelectedUserIds.length}</Text>
						<Text size="sm">
							<b>Roles a asignar:</b>{' '}
							{selectedRoles.length > 0
								? selectedRoles.map(id => roles.find(r => r._id === id)?.name || id).join(', ')
								: '— ninguno —'}
						</Text>
					</Box>

					{bulkLoading && (
						<Box>
							<LinearProgress />
							<Text size="sm" colorKey="text.secondary">
								Progreso: {progress.done}/{progress.total} · errores: {progress.fails}
							</Text>
						</Box>
					)}

					<FilledButton
						colorType="primary"
						btnVariant="solid"
						disabled={bulkSelectedUserIds.length === 0 || selectedRoles.length === 0 || bulkLoading}
						onClick={handleAssignRolesBulk}
						fullWidth
					>
						Asignar Roles a seleccionados
					</FilledButton>
				</SmartBox>
			</SmartBox>
		</Container>
	);
};

export default AssignRolesToUser;

