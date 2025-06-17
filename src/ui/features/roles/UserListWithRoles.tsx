import React, { useState, useEffect } from 'react';
import {
	Container,
	StyledTableContainer,
	StyledTableRow,
	StyledTableCell,
} from './userListWithRoles.styles';

import SectionTitle from '../../shared/atoms/titles/SectionTitle';
import SmartBox from '../../shared/atoms/box/SmartBox';
import Text from '../../shared/atoms/typography/Text';

import { Table, TableBody, TableHead, Pagination } from '@mui/material';
import { fetchUsersPaginated } from '../../../async/services/userService';

interface Role { _id: string; name: string; }
interface User { _id: string; username: string; email: string; roles: Role[] }

const UserListWithRoles: React.FC = () => {
	const [users, setUsers]       = useState<User[]>([]);
	const [currentPage, setPage]  = useState(1);
	const [totalPages, setTotal]  = useState(1);
	const usersPerPage            = 10;

	const load = (page: number) => {
		fetchUsersPaginated(page, usersPerPage)
			.then(({ list, totalPages }) => {
				setUsers(list);
				setTotal(totalPages);
			})
			.catch(err => {
				console.error(err);
				alert('Error al obtener usuarios');
			});
	};

	useEffect(() => {
		load(currentPage);
	}, [currentPage]);

	return (
		<Container>
			<SectionTitle variant="h5">Lista de Usuarios con sus Roles</SectionTitle>

			<StyledTableContainer>
				<Table>
					<TableHead>
						<StyledTableRow>
							<StyledTableCell>Usuario</StyledTableCell>
							<StyledTableCell>Email</StyledTableCell>
							<StyledTableCell>Roles</StyledTableCell>
						</StyledTableRow>
					</TableHead>
					<TableBody>
						{users.map(user => (
							<StyledTableRow key={user._id}>
								<StyledTableCell>
									<Text>{user.username}</Text>
								</StyledTableCell>
								<StyledTableCell>
									<Text size="sm" colorKey="text.secondary">{user.email}</Text>
								</StyledTableCell>
								<StyledTableCell>
									<Text>
										{user.roles?.length
											? user.roles.map(role => role.name).join(', ')
											: 'Sin roles asignados'}
									</Text>
								</StyledTableCell>
							</StyledTableRow>
						))}
					</TableBody>
				</Table>
			</StyledTableContainer>

			<SmartBox center mt='px4'>
				<Pagination
					count={totalPages}
					page={currentPage}
					onChange={(_, val) => setPage(val)}
					color="primary"
				/>
			</SmartBox>
		</Container>
	);
};

export default UserListWithRoles;

