import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { Box, useMediaQuery, useTheme, Pagination } from '@mui/material';
import Text from '../../shared/atoms/typography/Text';
import {
	UserManagementContainer,
	StyledTableContainer,
} from './userManagement.styles';
import UserCard from './UserCard';

import {
	fetchUsers,
	fetchCareers,
	deactivateUser,
	reactivateUser,
	blacklistUser,
	deleteUser,
	bulkAction,
} from '../../../async/services/adminUserService';
import { fetchFaculties } from '../../../async/services/careerService';

import { UserFilters } from './components/UserFilters';
import { BulkActions } from './components/BulkActions';
import { UsersTable } from './components/UsersTable';

// ===== Tipos =====
export interface Role { _id: string; name: string }
export interface Career { _id: string; name: string; facultyId?: string | { _id: string } }
export interface Faculty { _id: string; name: string }
export interface User {
	_id: string;
	username: string;
	email: string;
	careers?: Career[] | Array<string | { _id: string; name?: string }>;
	facultyId?: string | { _id: string };
	roles?: Role[];
	status: string;
	reportCount: number;
}

// ===== Constantes =====
const USERS_PER_PAGE = 10;

// ===== Helpers =====
const getId = (v: string | { _id?: string } | undefined): string | undefined =>
	typeof v === 'string' ? v : v?._id;

const normalizedFacultyId = (u: User): string | undefined => getId(u.facultyId);

const normalizedCareerIds = (u: User): string[] =>
	(u.careers ?? [])
.map((c: any) => {
	if (!c) return '';
	if (typeof c === 'string') return c;
	if (c._id) return c._id;
	if (c.career?._id) return c.career._id;
	return '';
})
.filter(Boolean);

const UserManagement: React.FC = () => {
	// Data principal
	const [list, setList] = useState<User[]>([]);
	const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

	// Catálogos
	const [careers, setCareers] = useState<Career[]>([]);
	const [faculties, setFaculties] = useState<Faculty[]>([]);

	// Filtros
	const [selectedFaculty, setSelectedFaculty] = useState<string>('');
	const [selectedCareerIds, setSelectedCareerIds] = useState<string[]>([]);
	const [searchQuery, setSearchQuery] = useState<string>('');
	const [selectedStatus, setSelectedStatus] = useState<string>('');

	// UI
	const theme = useTheme();
	const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

	// Paginación
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [totalPages, setTotalPages] = useState<number>(1);
	const [totalUsers, setTotalUsers] = useState<number>(0);

	// Flag de filtros (misma lógica)
	const filtersActive =
		!!selectedFaculty ||
		selectedCareerIds.length > 0 ||
		!!searchQuery ||
		!!selectedStatus;

	// Opciones de carreras por facultad (misma lógica)
	const careerOptionsForFaculty = useMemo(() => {
		if (!selectedFaculty) return careers;
		return careers.filter(c => getId(c.facultyId) === selectedFaculty);
	}, [careers, selectedFaculty]);

	// Al elegir facultad, autoselecciona todas sus carreras (misma lógica)
	useEffect(() => {
		if (!selectedFaculty) return;
		setSelectedCareerIds(careerOptionsForFaculty.map(c => c._id));
	}, [selectedFaculty, careerOptionsForFaculty]);

	// Carga de usuarios (misma lógica de params y setStates)
	useEffect(() => {
		const load = async () => {
			try {
				const params = filtersActive
					? {
						noPagination: 'true' as const,
						page: 1,
						limit: 0,
						...(selectedStatus && { status: selectedStatus }),
						...(selectedCareerIds.length === 1 && { career: selectedCareerIds[0] }),
						...(searchQuery && { search: searchQuery }),
					}
						: {
							page: currentPage,
							limit: USERS_PER_PAGE,
							...(selectedStatus && { status: selectedStatus }),
							...(selectedCareerIds.length === 1 && { career: selectedCareerIds[0] }),
							...(searchQuery && { search: searchQuery }),
						};

						const { list, totalPages, totalUsers } = await fetchUsers(params as any);
						setList(list);
						setTotalPages(totalPages);
						setTotalUsers(totalUsers);
			} catch (err) {
				console.error('Error al obtener usuarios:', err);
				alert('Error al obtener usuarios');
			}
		};
		load();
	}, [currentPage, selectedStatus, selectedCareerIds, searchQuery, filtersActive]);

	// Carga de catálogos (misma lógica)
	useEffect(() => {
		const loadCareersAndFacs = async () => {
			try {
				const [cars, facs] = await Promise.all([
					fetchCareers(),
					fetchFaculties().catch(() => [] as Faculty[]),
				]);
				setCareers(cars ?? []);
				setFaculties(facs ?? []);
			} catch (err) {
				console.error('Error al obtener catálogos:', err);
			}
		};
		loadCareersAndFacs();
	}, []);

	// Filtros en memoria (misma lógica)
	useEffect(() => {
		let filtered = [...list];

		if (searchQuery) {
			const q = searchQuery.toLowerCase();
			filtered = filtered.filter(u =>
									   u.username.toLowerCase().includes(q) || u.email.toLowerCase().includes(q),
									  );
		}

		if (selectedStatus) {
			filtered = filtered.filter(u => u.status === selectedStatus);
		}

		if (selectedCareerIds.length > 0) {
			const setSel = new Set(selectedCareerIds);
			filtered = filtered.filter(u => {
				const uC = normalizedCareerIds(u);
				return uC.length > 0 && uC.some(cid => setSel.has(cid));
			});
		}

		if (selectedFaculty) {
			const facultyCareerIds = careers
			.filter(c => getId(c.facultyId) === selectedFaculty)
			.map(c => c._id);
			const setFac = new Set(facultyCareerIds);

			filtered = filtered.filter(u => {
				if (normalizedFacultyId(u) === selectedFaculty) return true;
				const uC = normalizedCareerIds(u);
				return uC.length > 0 && uC.some(cid => setFac.has(cid));
			});
		}

		setFilteredUsers(filtered);
	}, [list, searchQuery, selectedStatus, selectedFaculty, selectedCareerIds, careers]);

	const handleDeactivate = useCallback(async (userId: string) => {
		if (!window.confirm('¿Desactivar este usuario?')) return;
		try {
			await deactivateUser(userId);
			setList(prev => prev.map(u => (u._id === userId ? { ...u, status: 'deactivated' } : u)));
			alert('Usuario desactivado exitosamente.');
		} catch (err) {
			console.error(err);
			alert('Error al desactivar usuario');
		}
	}, []);

	const handleReactivate = useCallback(async (userId: string) => {
		if (!window.confirm('¿Reactivar este usuario?')) return;
		try {
			await reactivateUser(userId);
			setList(prev => prev.map(u => (u._id === userId ? { ...u, status: 'active' } : u)));
			alert('Usuario reactivado exitosamente.');
		} catch (err) {
			console.error(err);
			alert('Error al reactivar usuario');
		}
	}, []);

	const handleBlacklist = useCallback(async (userId: string) => {
		if (!window.confirm('¿Bloquear este usuario?')) return;
		try {
			await blacklistUser(userId);
			setList(prev => prev.map(u => (u._id === userId ? { ...u, status: 'blacklisted' } : u)));
			alert('Usuario bloqueado exitosamente.');
		} catch (err) {
			console.error(err);
			alert('Error al bloquear usuario');
		}
	}, []);

	const handleDelete = useCallback(async (userId: string) => {
		if (!window.confirm('¿Eliminar este usuario?')) return;
		try {
			await deleteUser(userId);
			setList(prev => prev.filter(u => u._id !== userId));
			alert('Usuario eliminado exitosamente.');
		} catch (err) {
			console.error(err);
			alert('Error al eliminar usuario');
		}
	}, []);

	const handleBulkAction = useCallback(async (action: 'deactivate' | 'reactivate' | 'blacklist') => {
		if (!window.confirm(`¿${action} todos los usuarios filtrados?`)) return;
		try {
			const ids = filteredUsers.map(u => u._id);
			await bulkAction(ids, action);
			setList(prev =>
					prev.map(u =>
							 ids.includes(u._id)
								 ? { ...u, status: action === 'reactivate' ? 'active' : action }
								 : u,
							),
				   );
				   alert('Acción masiva completada.');
		} catch (err) {
			console.error(err);
			alert('Error en la acción masiva');
		}
	}, [filteredUsers]);

	// Paginación efectiva (misma lógica)
	const pagedUsers = useMemo(() => {
		if (!filtersActive) return filteredUsers; // server paging
		const start = (currentPage - 1) * USERS_PER_PAGE;
		const end = start + USERS_PER_PAGE;
		return filteredUsers.slice(start, end);
	}, [filtersActive, filteredUsers, currentPage]);

	const effectiveTotalPages = filtersActive
		? Math.max(1, Math.ceil(filteredUsers.length / USERS_PER_PAGE))
		: totalPages;

		return (
			<UserManagementContainer>
				<Text as="h3" headingLevel="h3" weight="bold" sx={{ mb: 2 }}>
					Gestión de Usuarios
				</Text>

				<UserFilters
					faculties={faculties}
					careers={careers}
					selectedFaculty={selectedFaculty}
					setSelectedFaculty={setSelectedFaculty}
					selectedCareerIds={selectedCareerIds}
					setSelectedCareerIds={setSelectedCareerIds}
					selectedStatus={selectedStatus}
					onStatusChange={setSelectedStatus}
					searchQuery={searchQuery}
					onSearchChange={setSearchQuery}
					careerOptionsForFaculty={careerOptionsForFaculty}
				/>

				{selectedFaculty && (
					<Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
						<button className="reset-btn" onClick={() => setSelectedCareerIds(careerOptionsForFaculty.map(c => c._id))}>Marcar todas las carreras</button>
						<button className="reset-btn" onClick={() => setSelectedCareerIds([])}>Desmarcar todas</button>
					</Box>
				)}

				{isSmallScreen ? (
					pagedUsers.map((user) => (
						<UserCard
							key={user._id}
							user={user}
							handleDeactivate={handleDeactivate}
							handleReactivate={handleReactivate}
							handleBlacklist={handleBlacklist}
							handleDelete={handleDelete}
						/>
					))
				) : (
					<StyledTableContainer>
						<BulkActions
							hasUsers={filteredUsers.length > 0}
							onBulkAction={handleBulkAction}
						/>

						<UsersTable
							users={pagedUsers}
							onDeactivate={handleDeactivate}
							onReactivate={handleReactivate}
							onBlacklist={handleBlacklist}
							onDelete={handleDelete}
						/>
					</StyledTableContainer>
				)}

				<Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
					<Pagination
						count={effectiveTotalPages}
						page={currentPage}
						onChange={(_, value) => setCurrentPage(value)}
						color="primary"
					/>
				</Box>
			</UserManagementContainer>
		);
};

export default UserManagement;
