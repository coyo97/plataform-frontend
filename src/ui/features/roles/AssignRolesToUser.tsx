import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Autocomplete, Box, Chip, Divider, LinearProgress, Snackbar, Alert, TextField } from '@mui/material';

import { Container } from './assignRolesToUser.styles';
import SmartBox from '../../shared/atoms/box/SmartBox';
import SectionTitle from '../../shared/atoms/titles/SectionTitle';
import FilledButton from '../../shared/atoms/buttons/filledButton/FilledButton';
import GhostButton from '../../shared/atoms/buttons/ghostButton/GhostButton';
import Text from '../../shared/atoms/typography/Text';

import RolePicker from './components/RolePicker';
import FacultyCareerFilter from './components/FacultyCareerFilter';
import UserSinglePicker from './components/UserSinglePicker';
import UserMultiPicker from './components/UserMultiPicker';
import SummaryBar from './components/SummaryBar';

import { getUsers, getRoles, assignRoles } from '../../../async/services/roleAssignmentService';
import { fetchFaculties, fetchCareers } from '../../../async/services/careerService';

// ===== Tipos
export interface User {
	_id: string;
	username: string;
	email: string;
	roles: any[];
	facultyId?: string | { _id: string };
	careers?: Array<string | { _id: string; name?: string; facultyId?: string | { _id: string } }>;
}
export interface Role { _id: string; name: string }
export interface Faculty { _id: string; name: string }
export interface Career  { _id: string; name: string; facultyId?: string | { _id: string } }

type Mode = 'single' | 'bulk';

// ===== Helpers robustos roles
function buildRoleNameToId(roles: { _id: string; name: string }[]) {
	const map = new Map<string, string>();
	roles.forEach(r => { if (r?._id && r?.name) map.set(r.name.toLowerCase(), r._id); });
	return map;
}
function getRoleIdsFromUserFlexible(
	u?: { roles?: any[] } | null,
	roleNameToId?: Map<string, string>
): string[] {
	if (!u?.roles) return [];
	const ids: string[] = [];
	for (const r of u.roles) {
		if (typeof r === 'string') { ids.push(r); continue; }
		if (r?._id) { ids.push(r._id); continue; }
		if (r?.id) { ids.push(r.id); continue; }
		if (r?.roleId) { ids.push(r.roleId); continue; }
		if (r?.role?._id) { ids.push(r.role._id); continue; }
		const name = (r?.name ?? r?.role?.name ?? '').toLowerCase();
		if (name && roleNameToId?.has(name)) { ids.push(roleNameToId.get(name)!); }
	}
	return Array.from(new Set(ids.filter(Boolean)));
}

const AssignRolesToUser: React.FC = () => {
	// ===== Estado
	const [mode, setMode] = useState<Mode>('single');

	const [users, setUsers] = useState<User[]>([]);
	const [roles, setRoles] = useState<Role[]>([]);
	const [faculties, setFaculties] = useState<Faculty[]>([]);
	const [careers, setCareers] = useState<Career[]>([]);

	// Individual
	const [selectedUserId, setSelectedUserId] = useState<string>('');

	// Roles (común a ambos modos)
	const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

	// Filtros (masivo)
	const [facultyId, setFacultyId] = useState<string>('');
	const [selectedCareerIds, setSelectedCareerIds] = useState<string[]>([]);

	// Selección masiva
	const [bulkSelectedUserIds, setBulkSelectedUserIds] = useState<string[]>([]);
	const [bulkLoading, setBulkLoading] = useState(false);
	const [progress, setProgress] = useState<{ done: number; total: number; fails: number }>({ done: 0, total: 0, fails: 0 });

	// Feedback
	const [snack, setSnack] = useState<{ open: boolean; msg: string; severity: 'success' | 'error' | 'info' }>(
		{ open: false, msg: '', severity: 'success' },
	);

	// ===== Carga
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
				setSnack({ open: true, msg: 'Error al cargar datos', severity: 'error' });
			}
		};
		fetchData();
	}, []);

	// ===== Helpers normalización
	const normalizedFacultyId = (u: User) =>
		typeof u.facultyId === 'string' ? u.facultyId : (u.facultyId?._id ?? undefined);

	const normalizedCareerIds = (u: User) =>
		(u.careers ?? [])
	.map(c => (typeof c === 'string' ? c : (c?._id ?? '')))
	.filter(Boolean);

	// Carreras por facultad (para UI)
	const careerOptionsForFaculty = useMemo(() => {
		if (!facultyId) return careers;
		return careers.filter(c => {
			const cf = typeof c.facultyId === 'string' ? c.facultyId : (c.facultyId as any)?._id;
			return cf === facultyId;
		});
	}, [careers, facultyId]);

	// Autoselección de carreras solo al cambiar la facultad (sin pisar elecciones del usuario)
	const prevFacultyRef = useRef<string>('');
	useEffect(() => {
		if (facultyId && prevFacultyRef.current !== facultyId) {
			setSelectedCareerIds(careerOptionsForFaculty.map(c => c._id));
			prevFacultyRef.current = facultyId;
		}
		if (!facultyId) {
			setSelectedCareerIds([]);
			prevFacultyRef.current = '';
		}
	}, [facultyId, careerOptionsForFaculty]);

	// ¿Usuario pertenece a una facultad?
	const userBelongsToFaculty = (u: User, facId: string) => {
		const fId = normalizedFacultyId(u);
		if (fId && fId === facId) return true;

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

	// Filtrado final (masivo)
	const filteredUsers = useMemo(() => {
		if (!facultyId && selectedCareerIds.length === 0) return users;

		return users.filter(u => {
			const uCareerIds = normalizedCareerIds(u);
			const hasCareers = uCareerIds.length > 0;

			if (facultyId) {
				if (!hasCareers) return normalizedFacultyId(u) === facultyId;

				const allowByCareer = uCareerIds.some(cid => selectedCareerIds.includes(cid));
				if (allowByCareer) return true;

				return userBelongsToFaculty(u, facultyId);
			}

			if (selectedCareerIds.length > 0) {
				if (!hasCareers) return false;
				return uCareerIds.some(cid => selectedCareerIds.includes(cid));
			}

			return true;
		});
	}, [users, facultyId, selectedCareerIds, careers]);

	// ===== IDs de los usuarios actualmente filtrados
	const allFilteredIds = useMemo(
		() => filteredUsers.map(u => u._id),
		[filteredUsers]
	);

	// ===== Estado de selección respecto a lo filtrado
	const allSelectedInFiltered = useMemo(
		() => allFilteredIds.length > 0 && allFilteredIds.every(id => bulkSelectedUserIds.includes(id)),
		[allFilteredIds, bulkSelectedUserIds]
	);

	const someSelectedInFiltered = useMemo(
		() => allFilteredIds.some(id => bulkSelectedUserIds.includes(id)) && !allSelectedInFiltered,
		[allFilteredIds, bulkSelectedUserIds, allSelectedInFiltered]
	);

	// ===== Acciones rápidas de selección de usuarios (filtrados)
	const handleSelectAllFiltered = () => {
		if (allFilteredIds.length === 0) return;
		const set = new Set([...bulkSelectedUserIds, ...allFilteredIds]);
		setBulkSelectedUserIds(Array.from(set));
	};
	const handleClearFilteredFromSelection = () => {
		if (allFilteredIds.length === 0) return;
		const set = new Set(allFilteredIds);
		setBulkSelectedUserIds(prev => prev.filter(id => !set.has(id)));
	};

	// ===== Estadísticas de roles en MASIVO
	const roleNameToId = useMemo(() => buildRoleNameToId(roles), [roles]);

	const selectedUsersBulk = useMemo(
		() => users.filter(u => bulkSelectedUserIds.includes(u._id)),
		[users, bulkSelectedUserIds]
	);

	const { roleCounts, commonRoleIds, partialRoleIds, absentRoleIds } = useMemo(() => {
		const counts = new Map<string, number>();
		const total = selectedUsersBulk.length || 0;

		if (total === 0) {
			return {
				roleCounts: counts,
				commonRoleIds: [] as string[],
				partialRoleIds: [] as string[],
				absentRoleIds: roles.map(r => r._id),
			};
		}

		for (const u of selectedUsersBulk) {
			const ids = getRoleIdsFromUserFlexible(u, roleNameToId);
			const set = new Set(ids);
			for (const id of set) counts.set(id, (counts.get(id) ?? 0) + 1);
		}

		const common: string[] = [];
		const partial: string[] = [];
		const absent: string[] = [];

		for (const r of roles) {
			const c = counts.get(r._id) ?? 0;
			if (c === total) common.push(r._id);
			else if (c === 0) absent.push(r._id);
			else partial.push(r._id);
		}

		return { roleCounts: counts, commonRoleIds: common, partialRoleIds: partial, absentRoleIds: absent };
	}, [selectedUsersBulk, roles, roleNameToId]);

	// En masivo: por defecto refleja la intersección (comunes)
	useEffect(() => {
		if (mode !== 'bulk') return;
		setSelectedRoles(commonRoleIds);
	}, [mode, commonRoleIds]);

	// En individual: al cambiar de usuario, refleja lo que YA tiene
	useEffect(() => {
		if (mode !== 'single') return;
		if (!selectedUserId) { setSelectedRoles([]); return; }
		const u = users.find(x => x._id === selectedUserId) || null;
		setSelectedRoles(getRoleIdsFromUserFlexible(u, roleNameToId));
	}, [mode, selectedUserId, users, roleNameToId]);

	// ===== Actions
	const handleAssignRoles = async () => {
		if (!selectedUserId) {
			setSnack({ open: true, msg: 'Selecciona un usuario.', severity: 'info' });
			return;
		}
		if (selectedRoles.length === 0) {
			setSnack({ open: true, msg: 'Selecciona al menos un rol.', severity: 'info' });
			return;
		}
		try {
			const updatedUser = await assignRoles(selectedUserId, selectedRoles);
			setUsers(prev => prev.map(u => (u._id === updatedUser._id ? updatedUser : u)));
			setSnack({ open: true, msg: 'Roles asignados correctamente', severity: 'success' });
		} catch (err) {
			console.error('Error al asignar roles:', err);
			setSnack({ open: true, msg: 'Error al asignar roles', severity: 'error' });
		}
	};

	const handleAssignRolesBulk = async () => {
		if (bulkSelectedUserIds.length === 0) {
			setSnack({ open: true, msg: 'No hay usuarios seleccionados.', severity: 'info' });
			return;
		}
		if (selectedRoles.length === 0) {
			setSnack({ open: true, msg: 'Selecciona al menos un rol antes de asignar.', severity: 'info' });
			return;
		}

		setBulkLoading(true);
		setProgress({ done: 0, total: bulkSelectedUserIds.length, fails: 0 });

		let totalDone = 0;
		let totalFails = 0;

		try {
			const batchSize = 25;
			for (let i = 0; i < bulkSelectedUserIds.length; i += batchSize) {
				const slice = bulkSelectedUserIds.slice(i, i + batchSize);
				const results = await Promise.allSettled(
					slice.map(id => assignRoles(id, selectedRoles))
				);
				let ok = 0, fail = 0;
				results.forEach(r => (r.status === 'fulfilled' ? ok++ : fail++));
				totalDone += ok + fail;
				totalFails += fail;

				setProgress(prev => ({ done: prev.done + ok + fail, total: prev.total, fails: prev.fails + fail }));
			}
			setSnack({
				open: true,
				msg: `Asignación completada: ${totalDone}/${bulkSelectedUserIds.length} procesados · errores: ${totalFails}`,
				severity: totalFails > 0 ? 'info' : 'success',
			});
		} catch (e) {
			console.error(e);
			setSnack({ open: true, msg: 'Error en la asignación masiva', severity: 'error' });
		} finally {
			setBulkLoading(false);
		}
	};

	return (
		<Container>
			{/* Header + sub-navegación */}
			<SmartBox row between mb="px2" >
				<SectionTitle>Asignar Roles a Usuarios</SectionTitle>
				<Box role="group" aria-label="Modo de asignación">
					<GhostButton
						colorType="secondary"
						type="button"
						label="Individual"
						onClick={() => setMode('single')}
					/>
					<GhostButton
						colorType="secondary"
						type="button"
						label="Masiva"
						onClick={() => setMode('bulk')}
					/>
				</Box>
			</SmartBox>

			{/* RolePicker único (en masivo pasamos los 'mixtos' para tri-estado si el componente lo soporta) */}
			<RolePicker
				roles={roles}
				selected={selectedRoles}
				onChange={setSelectedRoles}
				// Si tu RolePicker soporta prop "partial", se verá indeterminado para mixtos:
				// @ts-ignore
				partial={mode === 'bulk' ? partialRoleIds : []}
			/>

			<Divider />

			{mode === 'single' ? (
				<>
					<SmartBox column p="px8" mb="px1" radius="sm3x" shadow="sm" sx={{ backgroundColor: 'background.paper' }}>
						<Text headingLevel="h3" system="sans" sx={{ mb: 1 }}>Usuario</Text>
						<UserSinglePicker
							users={users}
							valueId={selectedUserId}
							onChangeId={(id, user) => {
								setSelectedUserId(id);
								setSelectedRoles(getRoleIdsFromUserFlexible(user, roleNameToId));
							}}
						/>
						<SmartBox mt="px1">
							<FilledButton
								colorType="primary"
								btnVariant="solid"
								type="button"
								onClick={handleAssignRoles}
								disabled={!selectedUserId || selectedRoles.length === 0}
								fullWidth
							>
								Asignar Roles (usuario seleccionado)
							</FilledButton>

						</SmartBox>
					</SmartBox>
				</>
			) : (
				<>
					{/* Filtros + múltiple selección */}
					<SmartBox row p="px1" mb="px1" radius="sm4x" shadow="xs" sx={{ backgroundColor: 'background.paper', gap: 12 }}>
						<FacultyCareerFilter
							faculties={faculties}
							careers={careers}
							facultyId={facultyId}
							selectedCareerIds={selectedCareerIds}
							careerOptionsForFaculty={careerOptionsForFaculty}
							onFacultyChange={(id) => setFacultyId(id)}
							onCareersChange={(ids) => setSelectedCareerIds(ids)}
							onSelectAllCareers={() => setSelectedCareerIds(careerOptionsForFaculty.map(c => c._id))}
							onClearCareers={() => setSelectedCareerIds([])}
						/>
					</SmartBox>

					{/* Acciones rápidas sobre usuarios filtrados */}
					<SmartBox row between mb="px1">
						<Text size="sm" colorKey="text.secondary">
							{allFilteredIds.length === 0
								? 'No hay usuarios con los filtros actuales'
								: `Filtrados: ${allFilteredIds.length} · Seleccionados dentro del filtro: ${
									allFilteredIds.filter(id => bulkSelectedUserIds.includes(id)).length
								}`}
						</Text>

						<SmartBox row sx={{ gap: 8 }}>
							<GhostButton
								colorType="secondary"
								type="button"
								label={
									allSelectedInFiltered
										? 'Todos (filtrados) ya seleccionados'
										: someSelectedInFiltered
											? 'Completar selección (filtrados)'
											: 'Seleccionar todos (filtrados)'
								}
								onClick={handleSelectAllFiltered}
								disabled={allFilteredIds.length === 0}
							/>
							<GhostButton
								colorType="secondary"
								type="button"
								label="Quitar selección (filtrados)"
								onClick={handleClearFilteredFromSelection}
								disabled={allFilteredIds.length === 0 || (!someSelectedInFiltered && !allSelectedInFiltered)}
							/>
						</SmartBox>
					</SmartBox>

					{/* Acciones rápidas de ROLES en masivo */}
					<SmartBox row between mb="px1">
						<Text size="xs" colorKey="text.secondary">
							Comunes: {commonRoleIds.length} · Mixtos: {partialRoleIds.length} · Ausentes: {absentRoleIds.length}
						</Text>
						<SmartBox row sx={{ gap: 8 }}>
							<GhostButton
								colorType="secondary"
								type="button"
								label="Seleccionar roles comunes"
								onClick={() => setSelectedRoles(commonRoleIds)}
								disabled={selectedUsersBulk.length === 0}
							/>
							<GhostButton
								colorType="secondary"
								type="button"
								label="Seleccionar unión de roles"
								onClick={() => {
									const union = Array.from(new Set([...commonRoleIds, ...partialRoleIds]));
									setSelectedRoles(union);
								}}
								disabled={selectedUsersBulk.length === 0}
							/>
							<GhostButton
								colorType="secondary"
								type="button"
								label="Limpiar selección de roles"
								onClick={() => setSelectedRoles([])}
								disabled={selectedUsersBulk.length === 0}
							/>
						</SmartBox>
					</SmartBox>

					{/* Lista múltiple de usuarios */}
					<SmartBox column p="px1" mb="px1" radius="sm3x" shadow="xs" sx={{ backgroundColor: 'background.paper' }}>
						<Text headingLevel="h3" system="sans" sx={{ mb: 1 }}>
							Usuarios filtrados ({filteredUsers.length})
						</Text>

						<UserMultiPicker
							users={filteredUsers}
							valueIds={bulkSelectedUserIds}
							onChangeIds={setBulkSelectedUserIds}
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
								type="button"
								disabled={bulkSelectedUserIds.length === 0 || selectedRoles.length === 0 || bulkLoading}
								onClick={handleAssignRolesBulk}
								fullWidth
							>
								Asignar Roles a seleccionados
							</FilledButton>

						</SmartBox>
					</SmartBox>
				</>
			)}

			{/* Summary bar común */}
			<SummaryBar
				mode={mode}
				roles={roles}
				selectedRoles={selectedRoles}
				selectedCount={mode === 'single' ? (selectedUserId ? 1 : 0) : bulkSelectedUserIds.length}
				loading={bulkLoading}
				progress={progress}
			/>

			<Snackbar
				open={snack.open}
				autoHideDuration={4000}
				onClose={() => setSnack(s => ({ ...s, open: false }))}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
			>
				<Alert severity={snack.severity} onClose={() => setSnack(s => ({ ...s, open: false }))}>
					{snack.msg}
				</Alert>
			</Snackbar>
		</Container>
	);
};

export default AssignRolesToUser;

