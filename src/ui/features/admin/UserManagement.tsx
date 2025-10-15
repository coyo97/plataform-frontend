import React, { useState, useEffect, useMemo } from 'react';
import getEnvVariables from '../../../config/configEnvs';
import { Box, useMediaQuery, useTheme, Autocomplete, Chip } from '@mui/material';
import { Pagination } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import Text from '../../shared/atoms/typography/Text';
import SearchIcon from '@mui/icons-material/Search';
import {
	Table,
	TableHead,
	TableBody,
	TextField as MuiTextField,
	Select, MenuItem, InputLabel, FormControl, ButtonGroup, InputAdornment,
} from '@mui/material';
import {
	UserManagementContainer,
	StyledTableContainer,
	StyledTableRow,
	StyledTableCell,
	ActionButtonContainer,
	ActionButton,
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

// ===== Tipos
interface Role { _id: string; name: string }
interface Career { _id: string; name: string; facultyId?: string | { _id: string } }
interface Faculty { _id: string; name: string }
interface User {
	_id: string;
	username: string;
	email: string;
	careers?: Career[] | Array<string | { _id: string; name?: string }>;
	facultyId?: string | { _id: string };
	roles?: Role[];
	status: string;
	reportCount: number;
}

const UserManagement: React.FC = () => {
	const [list, setList] = useState<User[]>([]);
	const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

	const [careers, setCareers] = useState<Career[]>([]);
	const [faculties, setFaculties] = useState<Faculty[]>([]);
	const [selectedFaculty, setSelectedFaculty] = useState<string>('');
	const [selectedCareerIds, setSelectedCareerIds] = useState<string[]>([]);

	const [searchQuery, setSearchQuery] = useState<string>('');
	const [selectedStatus, setSelectedStatus] = useState<string>('');

	const theme = useTheme();
	const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

	const [currentPage, setCurrentPage] = useState<number>(1);
	const [totalPages, setTotalPages] = useState<number>(1);
	const [totalUsers, setTotalUsers] = useState<number>(0);

	const usersPerPage = 10;

	const filtersActive =
		!!selectedFaculty ||
		selectedCareerIds.length > 0 ||
		!!searchQuery ||
		!!selectedStatus;


	// ===== Helpers de normalización
	const normalizedFacultyId = (u: User) =>
		typeof u.facultyId === 'string' ? u.facultyId : (u.facultyId as any)?._id;

	const normalizedCareerIds = (u: User) =>
		(u.careers ?? [])
	.map((c: any) => {
		if (!c) return '';
		if (typeof c === 'string') return c;        // id como string
		if (c._id) return c._id;                    // { _id, name }
		if (c.career?._id) return c.career._id;     // fallback si viene anidado
		return '';
	})
	.filter(Boolean);

	// Carreras mostradas según facultad seleccionada
	const careerOptionsForFaculty = useMemo(() => {
		if (!selectedFaculty) return careers;
		return careers.filter(c => {
			const cf = typeof c.facultyId === 'string' ? c.facultyId : (c.facultyId as any)?._id;
			return cf === selectedFaculty;
		});
	}, [careers, selectedFaculty]);

	// Autoseleccionar todas las carreras al elegir una facultad
	useEffect(() => {
		if (!selectedFaculty) return;
		setSelectedCareerIds(careerOptionsForFaculty.map(c => c._id));
	}, [selectedFaculty, careerOptionsForFaculty]);

	// ===== Carga inicial y cada cambio de filtros de servidor
	useEffect(() => {
		const load = async () => {
			try {
				const params = filtersActive
					? {
						// Trae TODO y pagina en cliente
						noPagination: 'true' as const,
						page: 1,
						limit: 0,
						...(selectedStatus && { status: selectedStatus }),
						// Puedes seguir mandando career único si lo usas
						...(selectedCareerIds.length === 1 && { career: selectedCareerIds[0] }),
						...(searchQuery && { search: searchQuery }),
					}
						: {
							// Paginación normal del server
							page: currentPage,
							limit: usersPerPage,
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


	// Cargar catálogos (facultades y carreras)
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

	// ===== Filtrado final en cliente (texto, estado, carreras, facultad)
	useEffect(() => {
		let filtered = [...list];

		// Texto
		if (searchQuery) {
			const q = searchQuery.toLowerCase();
			filtered = filtered.filter(u =>
									   u.username.toLowerCase().includes(q) ||
									   u.email.toLowerCase().includes(q)
									  );
		}

		// Estado
		if (selectedStatus)
			filtered = filtered.filter(u => u.status === selectedStatus);

		// Carreras (múltiples)
		if (selectedCareerIds.length > 0) {
			const setSel = new Set(selectedCareerIds);
			filtered = filtered.filter(u => {
				const uC = normalizedCareerIds(u);
				return uC.length > 0 && uC.some(cid => setSel.has(cid));
			});
		}

		// Facultad (si hay)
		if (selectedFaculty) {
			// IDs de carreras que pertenecen a la facultad elegida
			const facultyCareerIds = careers
			.filter(c => {
				const cf = typeof c.facultyId === 'string' ? c.facultyId : (c.facultyId as any)?._id;
				return cf === selectedFaculty;
			})
			.map(c => c._id);

			const setFac = new Set(facultyCareerIds);

			filtered = filtered.filter(u => {
				// 1) por facultyId directo
				if (normalizedFacultyId(u) === selectedFaculty) return true;
				// 2) derivado por carreras pertenecientes a la facultad
				const uC = normalizedCareerIds(u);
				return uC.length > 0 && uC.some(cid => setFac.has(cid));
			});
		}

		setFilteredUsers(filtered);
	}, [list, searchQuery, selectedStatus, selectedFaculty, selectedCareerIds, careers]);

	/* ---------- Handlers con servicios ---------- */
	const handleDeactivate = async (userId: string) => {
		if (!window.confirm('¿Desactivar este usuario?')) return;
		try {
			await deactivateUser(userId);
			setList(prev => prev.map(u => u._id === userId ? { ...u, status: 'deactivated' } : u));
			alert('Usuario desactivado exitosamente.');
		} catch (err) {
			console.error(err);
			alert('Error al desactivar usuario');
		}
	};

	const handleReactivate = async (userId: string) => {
		if (!window.confirm('¿Reactivar este usuario?')) return;
		try {
			await reactivateUser(userId);
			setList(prev => prev.map(u => u._id === userId ? { ...u, status: 'active' } : u));
			alert('Usuario reactivado exitosamente.');
		} catch (err) {
			console.error(err);
			alert('Error al reactivar usuario');
		}
	};

	const handleBlacklist = async (userId: string) => {
		if (!window.confirm('¿Bloquear este usuario?')) return;
		try {
			await blacklistUser(userId);
			setList(prev => prev.map(u => u._id === userId ? { ...u, status: 'blacklisted' } : u));
			alert('Usuario bloqueado exitosamente.');
		} catch (err) {
			console.error(err);
			alert('Error al bloquear usuario');
		}
	};

	const handleDelete = async (userId: string) => {
		if (!window.confirm('¿Eliminar este usuario?')) return;
		try {
			await deleteUser(userId);
			setList(prev => prev.filter(u => u._id !== userId));
			alert('Usuario eliminado exitosamente.');
		} catch (err) {
			console.error(err);
			alert('Error al eliminar usuario');
		}
	};

	const handleBulkAction = async (action: 'deactivate' | 'reactivate' | 'blacklist') => {
		if (!window.confirm(`¿${action} todos los usuarios filtrados?`)) return;
		try {
			const ids = filteredUsers.map(u => u._id);
			await bulkAction(ids, action);
			setList(prev =>
					prev.map(u =>
							 ids.includes(u._id)
								 ? { ...u, status: action === 'reactivate' ? 'active' : action }
								 : u
							)
				   );
				   alert('Acción masiva completada.');
		} catch (err) {
			console.error(err);
			alert('Error en la acción masiva');
		}
	};

	const handleStatusChange = (e: SelectChangeEvent) => {
		setSelectedStatus(e.target.value);
		setCurrentPage(1);
	};

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(e.target.value);
		setCurrentPage(1);
	};

	const pagedUsers = useMemo(() => {
		if (!filtersActive) return filteredUsers; // server paging
		const start = (currentPage - 1) * usersPerPage;
		const end = start + usersPerPage;
		return filteredUsers.slice(start, end);
	}, [filtersActive, filteredUsers, currentPage]);

	const effectiveTotalPages = filtersActive
		? Math.max(1, Math.ceil(filteredUsers.length / usersPerPage))
		: totalPages;


		return (
			<UserManagementContainer>
				{/* Título */}
				<Text as="h3" headingLevel="h3" weight="bold" sx={{ mb: 2 }}>
					Gestión de Usuarios
				</Text>

				{/* ── Controles: Buscador + Facultad + Carreras + Estado ── */}
				<Box
					sx={{
						display: 'grid',
						gridTemplateColumns: { xs: '1fr', sm: '1fr 260px', md: '1fr 240px 360px 220px' },
					gap: 2,
					alignItems: 'center',
					mb: 2,
					}}
				>
					{/* Buscador */}
					<MuiTextField
						placeholder="Buscar usuario por nombre o email"
						value={searchQuery}
						onChange={handleSearchChange}
						variant="outlined"
						size="small"
						fullWidth
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<SearchIcon fontSize="small" />
								</InputAdornment>
							),
						}}
					/>

					{/* Filtro Facultad */}
					<FormControl size="small" sx={{ minWidth: 220 }}>
						<InputLabel id="faculty-label">Todas las Facultades</InputLabel>
						<Select
							labelId="faculty-label"
							value={selectedFaculty}
							label="Todas las Facultades"
							onChange={(e) => {
								const id = e.target.value as string;
								setSelectedFaculty(id);
								// selectedCareerIds se autollenará en el useEffect
								setCurrentPage(1);
							}}
							renderValue={(v) =>
								v
									? (faculties.find((f) => f._id === v)?.name ?? 'Facultad')
									: 'Todas las Facultades'
							}
						>
							<MenuItem value="">
								<Text as="span" size="sm">Todas las Facultades</Text>
							</MenuItem>
							{faculties.map((f) => (
								<MenuItem key={f._id} value={f._id}>
									<Text as="span" size="sm">{f.name}</Text>
								</MenuItem>
							))}
						</Select>
					</FormControl>

					{/* Carreras (múltiple) */}
					<Autocomplete
						multiple
						disableCloseOnSelect
						options={selectedFaculty ? careerOptionsForFaculty : careers}
						value={(selectedFaculty ? careerOptionsForFaculty : careers).filter(c => selectedCareerIds.includes(c._id))}
						onChange={(_, vals) => {
							setSelectedCareerIds(vals.map(v => v._id));
							setCurrentPage(1);
						}}
						isOptionEqualToValue={(a, b) => a._id === b._id}
						getOptionLabel={(c) => c?.name ?? ''}
						renderTags={(value, getTagProps) =>
							value.map((option, index) => (
								<Chip {...getTagProps({ index })} key={option._id} label={option.name} />
						))
						}
						renderInput={(params) => (
							<MuiTextField
								{...params}
								size="small"
								label={selectedFaculty ? 'Carreras (de la facultad)' : 'Carreras'}
								placeholder="Seleccionar carreras…"
							/>
						)}
					/>

					{/* Estado */}
					<FormControl size="small" sx={{ minWidth: 200 }}>
						<InputLabel id="status-label">Todos los Estados</InputLabel>
						<Select
							labelId="status-label"
							value={selectedStatus}
							label="Todos los Estados"
							onChange={handleStatusChange}
						>
							<MenuItem value="">
								<Text as="span" size="sm">Todos los Estados</Text>
							</MenuItem>
							<MenuItem value="active"><Text as="span" size="sm">Activo</Text></MenuItem>
							<MenuItem value="deactivated"><Text as="span" size="sm">Desactivado</Text></MenuItem>
							<MenuItem value="blacklisted"><Text as="span" size="sm">Bloqueado</Text></MenuItem>
						</Select>
					</FormControl>
				</Box>

				{/* Accesos rápidos para carreras (aparece sólo si hay facultad) */}
				{selectedFaculty && (
					<Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
						<ActionButton onClick={() => setSelectedCareerIds(careerOptionsForFaculty.map(c => c._id))}>
							<Text as="span" size="sm" weight="medium">Marcar todas las carreras</Text>
						</ActionButton>
						<ActionButton onClick={() => setSelectedCareerIds([])}>
							<Text as="span" size="sm" weight="medium">Desmarcar todas</Text>
						</ActionButton>
					</Box>
				)}

				{/* ── Listado responsive ── */}
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
						{/* Acciones Masivas */}
						{filteredUsers.length > 0 && (
							<Box sx={{ mb: 2 }}>
								<Text as="div" size="md" weight="medium" sx={{ mb: 1 }}>
									Acciones Masivas:
								</Text>
								<ButtonGroup variant="contained" color="primary"   sx={{
									gap: 1, // 🔹 separa los botones
									'& .MuiButton-root': {
										borderRadius: '8px !important', 
									},
									}}>
									<ActionButton onClick={() => handleBulkAction('deactivate')}>
										<Text as="span" size="sm" weight="medium" colorKey="common.white">
											Desactivar Todos
										</Text>
									</ActionButton>
									<ActionButton onClick={() => handleBulkAction('reactivate')}>
										<Text as="span" size="sm" weight="medium" colorKey="common.white">
											Reactivar Todos
										</Text>
									</ActionButton>
									<ActionButton onClick={() => handleBulkAction('blacklist')}>
										<Text as="span" size="sm" weight="medium" colorKey="common.white">
											Bloquear Todos
										</Text>
									</ActionButton>
								</ButtonGroup>
							</Box>
						)}

						<Table style={{ minWidth: 800 }}>
							<TableHead>
								<StyledTableRow>
									{['Usuario','Email','Roles','Carreras','Estado','Reportes','Acciones'].map((h) => (
										(!isSmallScreen || !['Email','Roles','Carreras','Reportes'].includes(h)) && (
											<StyledTableCell key={h} {...(h==='Reportes'?{align:'right'}:{})}>
												<Text
													as="span"
													size="sm"
													weight="medium"
													colorKey="text.secondary"
													sx={{ textTransform: 'uppercase', letterSpacing: 0.3 }}
												>
													{h}
												</Text>
											</StyledTableCell>
										)
									))}
								</StyledTableRow>
							</TableHead>

							<TableBody>
								{pagedUsers.map((user) => (
									<StyledTableRow key={user._id}>
										<StyledTableCell>
											<Text as="span" weight="medium">{user.username}</Text>
										</StyledTableCell>

										{!isSmallScreen && (
											<StyledTableCell>
												<Text as="span" size="sm" colorKey="text.secondary">{user.email}</Text>
											</StyledTableCell>
										)}

										{!isSmallScreen && (
											<StyledTableCell>
												<Text as="span" size="sm" colorKey="text.secondary">
													{user.roles?.length ? user.roles.map((r) => r.name).join(', ') : 'Sin roles'}
												</Text>
											</StyledTableCell>
										)}

										{!isSmallScreen && (
											<StyledTableCell>
												<Text
													as="span"
													size="sm"
													colorKey="text.secondary"
													sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
												>
													{Array.isArray(user.careers) && user.careers.length
														? (user.careers as any[]).map((c) => (typeof c === 'string' ? c : c.name)).join(', ')
														: 'Sin carrera'}
												</Text>
											</StyledTableCell>
										)}

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

										{!isSmallScreen && (
											<StyledTableCell align="right">
												<Text as="span" size="sm" weight="medium" sx={{ fontVariantNumeric: 'tabular-nums' }}>
													{user.reportCount}
												</Text>
											</StyledTableCell>
										)}

										<StyledTableCell>
											<ActionButtonContainer>
												{user.status === 'active' && (
													<>
														<ActionButton onClick={() => handleDeactivate(user._id)}>
															<Text as="span" size="sm" weight="medium">Desactivar</Text>
														</ActionButton>
														<ActionButton onClick={() => handleBlacklist(user._id)}>
															<Text as="span" size="sm" weight="medium">Bloquear</Text>
														</ActionButton>
													</>
												)}

												{user.status === 'deactivated' && (
													<>
														<ActionButton onClick={() => handleReactivate(user._id)}>
															<Text as="span" size="sm" weight="medium">Reactivar</Text>
														</ActionButton>
														<ActionButton onClick={() => handleBlacklist(user._id)}>
															<Text as="span" size="sm" weight="medium">Bloquear</Text>
														</ActionButton>
														<ActionButton onClick={() => handleDelete(user._id)}>
															<Text as="span" size="sm" weight="medium">Eliminar</Text>
														</ActionButton>
													</>
												)}

												{user.status === 'blacklisted' && (
													<>
														<Text as="span" size="sm" colorKey="error.main" weight="medium" sx={{ mr: 1 }}>
															Usuario bloqueado
														</Text>
														<ActionButton onClick={() => handleDelete(user._id)}>
															<Text as="span" size="sm" weight="medium">Eliminar</Text>
														</ActionButton>
														<ActionButton onClick={() => handleReactivate(user._id)}>
															<Text as="span" size="sm" weight="medium">Reactivar</Text>
														</ActionButton>
													</>
												)}
											</ActionButtonContainer>
										</StyledTableCell>
									</StyledTableRow>
								))}
							</TableBody>
						</Table>
					</StyledTableContainer>
				)}

				{/* Paginación */}
				<Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
					<Pagination
						count={effectiveTotalPages}
						page={currentPage}
						onChange={(event, value) => setCurrentPage(value)}
						color="primary"
					/>
				</Box>
			</UserManagementContainer>
		);
};

export default UserManagement;

