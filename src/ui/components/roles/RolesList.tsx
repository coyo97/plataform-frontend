import React, { useState, useEffect } from 'react';
import axios from 'axios';
import getEnvVariables from '../../../config/configEnvs';
import {
    Container,
    Title,
    StyledTableContainer,
    StyledTableHead,
    StyledTableRow,
    StyledTableCell,
    PermissionList,
    DeleteButton,ActionButtonsContainer
} from './rolesList.styles';
import { Table, TableBody } from '@mui/material';

interface Role {
    _id: string;
    name: string;
    description?: string;
    permissions: {
        module: string;
        action: string;
    }[];
}

const RolesList: React.FC = () => {
    const [roles, setRoles] = useState<Role[]>([]);
    const { HOST, SERVICE } = getEnvVariables();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No se encontró el token. Por favor, inicia sesión.');
            return;
        }

        const fetchRoles = async () => {
            try {
                const response = await axios.get(`${HOST}${SERVICE}/roles`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setRoles(response.data.roles);
            } catch (error) {
                console.error('Error al obtener roles:', error);
                alert('Error al obtener roles');
            }
        };

        fetchRoles();
    }, [HOST, SERVICE]);

    const handleDeleteRole = async (roleId: string) => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No se encontró el token. Por favor, inicia sesión.');
            return;
        }

        try {
            await axios.delete(`${HOST}${SERVICE}/roles/${roleId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert('Rol eliminado exitosamente');
            setRoles((prevRoles) => prevRoles.filter((role) => role._id !== roleId));
        } catch (error) {
            console.error('Error al eliminar rol:', error);
            alert('Error al eliminar rol');
        }
    };

    return (
        <Container>
            <Title variant="h4">Lista de Roles</Title>
            <StyledTableContainer>
                <Table>
                    <StyledTableHead>
                        <StyledTableRow>
                            <StyledTableCell data-label="Nombre">Nombre</StyledTableCell>
                            <StyledTableCell data-label="Descripción">Descripción</StyledTableCell>
                            <StyledTableCell data-label="Permisos">Permisos</StyledTableCell>
                        </StyledTableRow>
                    </StyledTableHead>
<TableBody>
	{roles.map((role) => (
		<StyledTableRow key={role._id}>
			<StyledTableCell data-label="Nombre">{role.name}</StyledTableCell>
			<StyledTableCell data-label="Descripción">
				{role.description || 'Sin descripción'}
			</StyledTableCell>
			<StyledTableCell data-label="Permisos">
				<PermissionList>
					{role.permissions.map((perm, index) => (
						<li key={index}>
							{perm.module} - {perm.action}
						</li>
					))}
				</PermissionList>
				<ActionButtonsContainer>
					<DeleteButton onClick={() => handleDeleteRole(role._id)}>
						Eliminar
					</DeleteButton>
				</ActionButtonsContainer>
			</StyledTableCell>
		</StyledTableRow>
	))}
</TableBody>
                </Table>
            </StyledTableContainer>
        </Container>
    );
};

export default RolesList;

