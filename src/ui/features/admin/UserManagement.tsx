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
		const token = localStorage.getItem('token');
		if (!token) {
			console.error('No se encontró el token. Por favor, inicia sesión.');
			return;
		}

		const fetchUsers = async () => {
			try {
				const response = await axios.get(`${HOST}${SERVICE}/users`, {
					headers: { Authorization: `Bearer ${token}` },
					params: {
						page: currentPage,
						limit: usersPerPage,
						status: selectedStatus,
						career: selectedCareer,
						search: searchQuery,
					},
				});
				if (response.data && response.data.list) {
					setList(response.data.list);
					setFilteredUsers(response.data.list);
					setTotalPages(response.data.totalPages); // Actualizar el total de páginas
					setTotalUsers(response.data.totalUsers); // Actualizar el total de usuarios (si lo necesitas)
				} else {
					console.error('La respuesta de usuarios no contiene los datos esperados.');
				}
			} catch (error) {
				console.error('Error al obtener usuarios:', error);
				alert('Error al obtener usuarios');
			}
		};

		fetchUsers();
	}, [HOST, SERVICE, currentPage, selectedStatus, selectedCareer, searchQuery]);
	// Efecto para obtener las carreras
	useEffect(() => {
		const token = localStorage.getItem('token');
		if (!token) {
			console.error('No se encontró el token. Por favor, inicia sesión.');
			return;
		}

		const fetchCareers = async () => {
			try {
				const response = await axios.get(`${HOST}${SERVICE}/careers`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				setCareers(response.data.careers);
			} catch (error) {
				console.error('Error al obtener carreras:', error);
			}
		};

		fetchCareers();
	}, [HOST, SERVICE]);

	// Filtrar usuarios por carrera seleccionada
	useEffect(() => {
		let filtered = list;
		if (selectedCareer) {
			filtered = filtered.filter(user =>
									   user.careers && user.careers.some(career => career._id === selectedCareer)
									  );
		}
		if (searchQuery) {
			filtered = filtered.filter(user =>
									   user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
									   user.email.toLowerCase().includes(searchQuery.toLowerCase())
									  );
		}

		if (selectedStatus) {
			filtered = filtered.filter(user => user.status === selectedStatus);
		}

		setFilteredUsers(filtered);
	}, [selectedCareer, searchQuery, selectedStatus, list]);

	const handleDeactivate = async (userId: string) => {
		const confirm = window.confirm('¿Estás seguro de que deseas desactivar este usuario?');
		if (!confirm) return;

		const token = localStorage.getItem('token');
		try {
			await axios.put(
				`${HOST}${SERVICE}/users/${userId}/deactivate`,
				{},
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			setList(prevList => prevList.map(user => (user._id === userId ? { ...user, status: 'deactivated' } : user)));
			alert('Usuario desactivado exitosamente.');
		} catch (error) {
			console.error('Error al desactivar usuario:', error);
			alert('Error al desactivar usuario');
		}
	};

	const handleReactivate = async (userId: string) => {
		const confirm = window.confirm('¿Estás seguro de que deseas reactivar este usuario?');
		if (!confirm) return;

		const token = localStorage.getItem('token');
		try {
			await axios.put(
				`${HOST}${SERVICE}/users/${userId}/reactivate`,
				{},
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			setList(prevList => prevList.map(user => (user._id === userId ? { ...user, status: 'active' } : user)));
			alert('Usuario reactivado exitosamente.');
		} catch (error) {
			console.error('Error al reactivar usuario:', error);
			alert('Error al reactivar usuario');
		}
	};

	const handleBlacklist = async (userId: string) => {
		const confirm = window.confirm('¿Estás seguro de que deseas bloquear este usuario? Esta acción no puede deshacerse.');
		if (!confirm) return;

		const token = localStorage.getItem('token');
		try {
			await axios.put(
				`${HOST}${SERVICE}/users/${userId}/blacklist`,
				{},
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			setList(prevList => prevList.map(user => (user._id === userId ? { ...user, status: 'blacklisted' } : user)));
			alert('Usuario bloqueado exitosamente.');
		} catch (error) {
			console.error('Error al bloquear usuario:', error);
			alert('Error al bloquear usuario');
		}
	};

	const handleDelete = async (userId: string) => {
		const confirm = window.confirm('¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.');
		if (!confirm) return;

		const token = localStorage.getItem('token');
		try {
			await axios.delete(`${HOST}${SERVICE}/users/${userId}`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			setList(prevList => prevList.filter(user => user._id !== userId));
			alert('Usuario eliminado exitosamente.');
		} catch (error) {
			console.error('Error al eliminar usuario:', error);
			alert('Error al eliminar usuario');
		}
	};

	const handleBulkAction = async (action: string) => {
		const confirm = window.confirm(`¿Estás seguro de que deseas ${action} todos los usuarios de esta carrera?`);
		if (!confirm) return;

		const token = localStorage.getItem('token');
		try {
			// Obtener los IDs de los usuarios filtrados actualmente
			const userIds = filteredUsers.map(user => user._id);

			// Realizar la solicitud al backend para actualizar múltiples usuarios
			await axios.put(
				`${HOST}${SERVICE}/users/${userIds}/bulk-action`,
				{ userIds, action },
				{ headers: { Authorization: `Bearer ${token}` } }
			);

			// Actualizar el estado local de los usuarios
			setList(prevList => prevList.map(user => {
				if (userIds.includes(user._id)) {
					return { ...user, status: action === 'reactivate' ? 'active' : action === 'deactivate' ? 'deactivated' : 'blacklisted' };
				}
				return user;
			}));

			alert(`Usuarios ${action === 'reactivate' ? 'reactivados' : action === 'deactivate' ? 'desactivados' : 'bloqueados'} exitosamente.`);
		} catch (error) {
			console.error(`Error al ${action} usuarios:`, error);
			alert(`Error al ${action} usuarios`);
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

