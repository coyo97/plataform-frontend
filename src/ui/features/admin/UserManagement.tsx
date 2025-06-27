import React, { useState, useEffect } from 'react';
import axios from 'axios';
import getEnvVariables from '../../../config/configEnvs';
import { useMediaQuery, useTheme } from '@mui/material';

import { Pagination } from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';

import {
	Table,
	TableHead,
	TableBody,
	Typography,
	TextField,
	Accordion,
	AccordionSummary,
	AccordionDetails,
	Select, MenuItem, InputLabel, FormControl,ButtonGroup
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
	UserManagementContainer,
	Title,
	StyledTableContainer,
	StyledTableRow,
	StyledTableCell,
	ActionButtonContainer,
	ActionButton,
	FilterButton, // Importa o define FilterButton si no existe
} from './userManagement.styles';
import UserCard from './UserCard'; // Importa el componente UserCard
import {
	fetchUsers,
	fetchCareers,
	deactivateUser,
	reactivateUser,
	blacklistUser,
	deleteUser,
	bulkAction,
} from '../../../async/services/adminUserService';

interface Role {
	_id: string;
	name: string;
}

interface Career {
	_id: string;
	name: string;
}

interface User {
	_id: string;
	username: string;
	email: string;
	careers?: Career[]; // Array opcional de Career
	roles?: Role[];
	status: string;
	reportCount: number;
}

const UserManagement: React.FC = () => {
	const [list, setList] = useState<User[]>([]);
	const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
	const [careers, setCareers] = useState<Career[]>([]);
	const [selectedCareer, setSelectedCareer] = useState<string>('');
	const [searchQuery, setSearchQuery] = useState<string>('');
	const { HOST, SERVICE } = getEnvVariables();
	const [selectedStatus, setSelectedStatus] = useState<string>('');
	const theme = useTheme();
	const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [totalPages, setTotalPages] = useState<number>(1);
	const usersPerPage = 10; // Puedes ajustar este valor según tus necesidades
	const [totalUsers, setTotalUsers] = useState<number>(0);

	useEffect(() => {
		const load = async () => {
			try {
				const { list, totalPages, totalUsers } = await fetchUsers({
					page  : currentPage,
					limit : usersPerPage,
					...(selectedStatus  && { status: selectedStatus }),
					...(selectedCareer  && { career: selectedCareer }),
					...(searchQuery     && { search: searchQuery }),
				});
				setList(list);               // ← guardamos la lista cruda
				setTotalPages(totalPages);
				setTotalUsers(totalUsers);
			} catch (err) {
				console.error('Error al obtener usuarios:', err);
				alert('Error al obtener usuarios');
			}
		};
		load();
	}, [currentPage, selectedStatus, selectedCareer, searchQuery]);


	useEffect(() => {
		let filtered = list;

		if (selectedCareer)
			filtered = filtered.filter(u =>
									   u.careers?.some(c => c._id === selectedCareer)
									  );

									  if (searchQuery) {
										  const q = searchQuery.toLowerCase();
										  filtered = filtered.filter(u =>
																	 u.username.toLowerCase().includes(q) ||
																	 u.email.toLowerCase().includes(q)
																	);
									  }

									  if (selectedStatus)
										  filtered = filtered.filter(u => u.status === selectedStatus);

									  setFilteredUsers(filtered);
	}, [list, selectedCareer, searchQuery, selectedStatus]);

	useEffect(() => {
		const loadCareers = async () => {
			try {
				const data = await fetchCareers();
				setCareers(data);
			} catch (err) {
				console.error('Error al obtener carreras:', err);
			}
		};
		loadCareers();
	}, []);

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
		setCurrentPage(1); // Resetear a la primera página
	};

	const handleCareerChange = (careerId: string) => {
		setSelectedCareer(careerId);
		setCurrentPage(1); // Resetear a la primera página
	};

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(e.target.value);
		setCurrentPage(1); // Resetear a la primera página
	};

	return (
		<UserManagementContainer>
			<Title variant="h6">Gestión de Usuarios</Title>

			{/* Barra de búsqueda */}
			<TextField
				placeholder="Buscar usuario por nombre o email"
				value={searchQuery}
				onChange={handleSearchChange}
				variant="outlined"
				size="small"
				style={{ marginBottom: '20px' }}
			/>

			{/* Filtro de carreras */}
			<Accordion>
				<AccordionSummary expandIcon={<ExpandMoreIcon />}>
					<Typography>Filtrar por Carrera</Typography>
				</AccordionSummary>
				<AccordionDetails>
					{careers.map((career) => (
						<div key={career._id} style={{ marginBottom: '10px' }}>
							<FilterButton
								active={selectedCareer === career._id}
								onClick={() => handleCareerChange(career._id)}
							>
								{career.name}
							</FilterButton>
							{selectedCareer === career._id && (
								<div style={{ marginTop: '10px' }}>
									<ActionButton onClick={() => handleBulkAction('deactivate')}>Desactivar Todos</ActionButton>
									<ActionButton onClick={() => handleBulkAction('reactivate')}>Reactivar Todos</ActionButton>
									<ActionButton onClick={() => handleBulkAction('blacklist')}>Bloquear Todos</ActionButton>
								</div>
							)}
						</div>
					))}
					{/* Botón para ver todos los usuarios */}
					<FilterButton
						active={selectedCareer === ''}
						onClick={() => setSelectedCareer('')}
					>
						Ver todos los usuarios
					</FilterButton>
				</AccordionDetails>
			</Accordion>

			{isSmallScreen ? (
				filteredUsers.map((user) => (
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
					<FormControl variant="outlined" size="small" style={{ marginBottom: '20px', minWidth: 200 }}>
						<InputLabel id="status-label">Filtrar por Estado</InputLabel>
						<Select
							labelId="status-label"
							value={selectedStatus}
							onChange={handleStatusChange}
							label="Filtrar por Estado"
						>
							<MenuItem value="">Todos los estados</MenuItem>
							<MenuItem value="active">Activo</MenuItem>
							<MenuItem value="deactivated">Desactivado</MenuItem>
							<MenuItem value="blacklisted">Bloqueado</MenuItem>


						</Select>

					</FormControl>
					{/* Acciones Masivas */}
					{filteredUsers.length > 0 && (
						<div style={{ marginBottom: '20px' }}>
							<Typography variant="subtitle1">Acciones Masivas:</Typography>
							<ButtonGroup variant="contained" color="primary">
								<ActionButton onClick={() => handleBulkAction('deactivate')}>Desactivar Todos</ActionButton>
								<ActionButton onClick={() => handleBulkAction('reactivate')}>Reactivar Todos</ActionButton>
								<ActionButton onClick={() => handleBulkAction('blacklist')}>Bloquear Todos</ActionButton>
							</ButtonGroup>
						</div>
					)}

					<Table style={{ minWidth: 800 }}>
						<TableHead>
							<StyledTableRow>
								<StyledTableCell>Usuario</StyledTableCell>
								{!isSmallScreen && <StyledTableCell>Email</StyledTableCell>}
								{!isSmallScreen && <StyledTableCell>Roles</StyledTableCell>}
								{!isSmallScreen && <StyledTableCell>Carreras</StyledTableCell>}
								<StyledTableCell>Estado</StyledTableCell>
								{!isSmallScreen && <StyledTableCell>Reportes</StyledTableCell>}
								<StyledTableCell>Acciones</StyledTableCell>
							</StyledTableRow>
						</TableHead>
						<TableBody>
							{filteredUsers.map((user) => (
								<StyledTableRow key={user._id}>
									<StyledTableCell>{user.username}</StyledTableCell>
									{!isSmallScreen && <StyledTableCell>{user.email}</StyledTableCell>}
									{!isSmallScreen && (
										<StyledTableCell>
											{user.roles && user.roles.length > 0
												? user.roles.map((role) => role.name).join(', ')
												: 'Sin roles'}
										</StyledTableCell>
									)}
									{!isSmallScreen && (
										<StyledTableCell>
											{user.careers && user.careers.length > 0
												? user.careers.map((career) => career.name).join(', ')
												: 'Sin carrera'}
										</StyledTableCell>
									)}
									<StyledTableCell>{user.status || 'Sin estado'}</StyledTableCell>
									{!isSmallScreen && <StyledTableCell>{user.reportCount}</StyledTableCell>}
									<StyledTableCell>
										<ActionButtonContainer>
											{user.status === 'active' && (
												<>
													<ActionButton onClick={() => handleDeactivate(user._id)}>Desactivar</ActionButton>
													<ActionButton onClick={() => handleBlacklist(user._id)}>Bloquear</ActionButton>
												</>
											)}
											{user.status === 'deactivated' && (
												<>
													<ActionButton onClick={() => handleReactivate(user._id)}>Reactivar</ActionButton>
													<ActionButton onClick={() => handleBlacklist(user._id)}>Bloquear</ActionButton>
													<ActionButton onClick={() => handleDelete(user._id)}>Eliminar</ActionButton>
												</>
											)}
											{user.status === 'blacklisted' && (
												<>
													<Typography variant="body2" color="error">Usuario bloqueado</Typography>
													<ActionButton onClick={() => handleDelete(user._id)}>Eliminar</ActionButton>
													<ActionButton onClick={() => handleReactivate(user._id)}>Reactivar</ActionButton>
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
			<div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
				<Pagination
					count={totalPages}
					page={currentPage}
					onChange={(event, value) => setCurrentPage(value)}
					color="primary"
				/>
			</div>
		</UserManagementContainer>
	);
};

export default UserManagement;

