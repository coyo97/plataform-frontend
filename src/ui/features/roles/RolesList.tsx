// src/ui/components/roles/RolesList.tsx
import React, { useEffect, useMemo, useState } from 'react';
import SectionTitle from '../../shared/atoms/titles/SectionTitle';
import SmartBox from '../../shared/atoms/box/SmartBox';
import Text from '../../shared/atoms/typography/Text';
import TableView from '../../shared/organisms/table/TableView';
import type { ColumnDef, RowAction } from '../../shared/organisms/table/tableView.types';

import { listRoles, deleteRole } from '../../../async/services/roleService';
import { PermissionList } from './rolesList.styles';

interface Role {
	_id: string;
	name: string;
	description?: string;
	permissions?: { _id: string; module: { name: string }; action: { name: string } }[];
}

const RolesList: React.FC<{ onSelectRole: (id: string) => void }> = ({ onSelectRole }) => {
	const [roles, setRoles] = useState<Role[]>([]);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		const load = async () => {
			try {
				const data = await listRoles();
				setRoles(data || []);
			} catch (err) {
				console.error('Error al obtener roles:', err);
				setRoles([]); // fallback
			} finally {
				setLoading(false);
			}
		};
		load();
	}, []);

	const handleRemove = async (id: string) => {
		if (!window.confirm('¿Eliminar rol?')) return;
		try {
			await deleteRole(id);
			setRoles(prev => prev.filter(r => r._id !== id));
			alert('Rol eliminado');
		} catch (err) {
			console.error(err);
			alert('Error al eliminar rol');
		}
	};

	const columns: ColumnDef<Role>[] = useMemo(() => ([
		{
			id: 'name',
			header: 'Nombre',
			accessor: 'name',
			minWidth: 160,
			truncate: true,
		},
		{
			id: 'description',
			header: 'Descripción',
			minWidth: 240,
			truncate: true,
			hiddenAt: ['xs'], // oculta en móviles
			renderCell: (r) => (
				<Text as="span" size="sm" colorKey="gray.600">
					{r.description || 'Sin descripción'}
				</Text>
			),
		},
		{
			id: 'permissions',
			header: 'Permisos',
			minWidth: 320,
			renderCell: (r) => {
				const perms = r.permissions ?? [];
				if (!perms.length) return <Text size="sm">Sin permisos</Text>;
				return (
					<PermissionList>
						{perms.map(p => (
							<li key={p._id}>
								<Text size="sm">
									{p.module?.name} - {p.action?.name}
								</Text>
							</li>
						))}
					</PermissionList>
				);
			},
		},
	]), []);

	const rowActions: RowAction<Role>[] = useMemo(() => ([
		{
			label: 'Editar',
			variant: 'ghost',
			color: 'primary',
			onClick: (r) => onSelectRole(r._id),
		},
		{
			label: 'Eliminar',
			variant: 'ghost',
			color: 'secondary',
			onClick: (r) => handleRemove(r._id),
		},
	]), [onSelectRole]);

	return (
		<SmartBox column gap={3} p="px12">
			<SectionTitle>Lista de Roles</SectionTitle>

			<TableView<Role>
				data={roles}
				rowKey="_id"
				columns={columns}
				rowActions={rowActions}
				loading={loading}
				emptyMessage="No hay roles disponibles."
				stickyHeader
				zebra
				hoverable
				skin="default"
				responsiveMode="auto"   
				/>
			</SmartBox>
	);
};

export default RolesList;

