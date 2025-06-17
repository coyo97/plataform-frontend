import React, { useState, useEffect } from 'react';

import {
	StyledTableContainer,
	StyledTableHead,
	StyledTableRow,
	StyledTableCell,
	PermissionList,
} from './rolesList.styles';

import {
	Table,
	TableBody,
} from '@mui/material';

import SectionTitle from '../../shared/atoms/titles/SectionTitle';
import SmartBox from '../../shared/atoms/box/SmartBox';
import Text from '../../shared/atoms/typography/Text';
import GhostButton from '../../shared/atoms/buttons/ghostButton/GhostButton';

import { listRoles, deleteRole } from '../../../async/services/roleService';

interface Role {
	_id: string;
	name: string;
	description?: string;
	permissions?: { _id: string; module: { name: string }; action: { name: string } }[];
}

const RolesList: React.FC<{ onSelectRole: (id: string) => void }> = ({ onSelectRole }) => {
	const [roles, setRoles] = useState<Role[]>([]);

	useEffect(() => {
		listRoles()
			.then(setRoles)
			.catch(err => {
				console.error('Error al obtener roles:', err);
				alert('Error al obtener roles');
			});
	}, []);

	const handleRemove = async (id: string) => {
		if (!window.confirm('Eliminar rol?')) return;
		try {
			await deleteRole(id);
			setRoles(prev => prev.filter(r => r._id !== id));
			alert('Rol eliminado');
		} catch (err) {
			console.error(err);
			alert('Error al eliminar rol');
		}
	};

	return (
		<SmartBox column gap={3} p="px12">
			<SectionTitle>Lista de Roles</SectionTitle>

			<StyledTableContainer>
				<Table>
					<StyledTableHead>
						<StyledTableRow>
							<StyledTableCell>Nombre</StyledTableCell>
							<StyledTableCell>Descripción</StyledTableCell>
							<StyledTableCell>Permisos</StyledTableCell>
						</StyledTableRow>
					</StyledTableHead>
					<TableBody>
						{roles.length ? roles.map(r => (
							<StyledTableRow key={r._id}>
								<StyledTableCell>
									<Text size="md">{r.name}</Text>
								</StyledTableCell>
								<StyledTableCell>
									<Text size="sm" colorKey="gray.600">
										{r.description || 'Sin descripción'}
									</Text>
								</StyledTableCell>
								<StyledTableCell>
									{r.permissions?.length ? (
										<PermissionList>
											{r.permissions.map(p => (
												<li key={p._id}>
													<Text size="sm">{p.module?.name} - {p.action?.name}</Text>
												</li>
											))}
										</PermissionList>
									) : (
										<Text size="sm" >Sin permisos</Text>
									)}

									<SmartBox row gap={1} mt="px4">
										<GhostButton label="Editar" onClick={() => onSelectRole(r._id)} />
										<GhostButton label="Eliminar" colorType="secondary" onClick={() => handleRemove(r._id)} />
									</SmartBox>
								</StyledTableCell>
							</StyledTableRow>
						)) : (
							<StyledTableRow>
								<StyledTableCell colSpan={3} align="center">
									<Text size="md" weight="medium">No hay roles disponibles.</Text>
								</StyledTableCell>
							</StyledTableRow>
						)}
					</TableBody>
				</Table>
			</StyledTableContainer>
		</SmartBox>
	);
};

export default RolesList;

