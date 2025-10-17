// src/ui/components/users/UserListWithRoles.tsx
import React, { useEffect, useState, useMemo } from 'react';
import SectionTitle from '../../shared/atoms/titles/SectionTitle';
import Text from '../../shared/atoms/typography/Text';

import TableView from '../../shared/organisms/table/TableView';
import type { ColumnDef } from '../../shared/organisms/table/tableView.types';

import { Container } from './userListWithRoles.styles';
import { fetchUsersPaginated } from '../../../async/services/userService';

interface Role { _id: string; name: string }
interface User { _id: string; username: string; email: string; roles: Role[] }

const usersPerPage = 10;

const UserListWithRoles: React.FC = () => {
	const [users, setUsers] = useState<User[]>([]);
	const [currentPage, setPage] = useState(1);
	const [totalPages, setTotal] = useState(1);
	const [loading, setLoading] = useState(true);

	const load = async (page: number) => {
		try {
			setLoading(true);
			const { list, totalPages } = await fetchUsersPaginated(page, usersPerPage);
			setUsers(list || []);
			setTotal(totalPages || 1);
		} catch (err) {
			console.error('Error al obtener usuarios:', err);
			setUsers([]); // fallback
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		load(currentPage);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentPage]);

	// 🔹 Columnas — el Email SIEMPRE visible
	const columns: ColumnDef<User>[] = useMemo(() => [
		{
			id: 'username',
			header: 'Usuario',
			accessor: 'username',
			minWidth: 160,
			truncate: true,
		},
		{
			id: 'email',
			header: 'Email',
			accessor: 'email',
			minWidth: 220,
			truncate: true,
			// ⚠️ no usar hiddenAt aquí → el email debe verse en móvil y desktop
		},
		{
			id: 'roles',
			header: 'Roles',
			minWidth: 220,
			truncate: true,
			hiddenAt: ['xs'], // opcional: oculta en móvil si falta espacio
			renderCell: (u) => (
				<Text as="span" size="sm" colorKey="text.secondary">
					{u.roles?.length ? u.roles.map(r => r.name).join(', ') : 'Sin roles asignados'}
				</Text>
			),
		},
	], []);

	return (
		<Container sx={{ overflowX: 'clip' }}>
			<SectionTitle variant="h5">Lista de Usuarios con sus Roles</SectionTitle>

			<TableView<User>
				data={users}
				rowKey="_id"
				columns={columns}
				loading={loading}
				emptyMessage="No hay usuarios."
				stickyHeader
				zebra
				hoverable
				skin="default"
				responsiveMode="auto"   // deja que TableView elija: card (móvil) / scroll (desktop)
				pagination={{
					page: currentPage,
					totalPages,
					onChangePage: (p) => setPage(p),
				}}
				/>
			</Container>
	);
};

export default UserListWithRoles;

