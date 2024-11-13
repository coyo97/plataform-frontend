import React, { useState, useEffect } from 'react';
import axios from 'axios';
import getEnvVariables from '../../../config/configEnvs';
import {
    Container,
    Title,
    StyledTableContainer,
    StyledTableRow,
    StyledTableCell,
} from './userListWithRoles.styles';
import { Table, TableBody, TableHead } from '@mui/material';

interface Role {
    _id: string;
    name: string;
}

interface User {
    _id: string;
    username: string;
    email: string;
    roles: Role[];
}

const UserListWithRoles: React.FC = () => {
    const [list, setUsers] = useState<User[]>([]);
    const { HOST, SERVICE } = getEnvVariables();

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
                });

                if (response.data && response.data.list) {
                    setUsers(response.data.list);
                } else {
                    console.error('La respuesta no contiene la lista de usuarios esperada.');
                }
            } catch (error) {
                console.error('Error al obtener usuarios:', error);
                alert('Error al obtener usuarios');
            }
        };

        fetchUsers();
    }, [HOST, SERVICE]);

    return (
        <Container>
            <Title variant="h4">Lista de Usuarios con sus Roles</Title>
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
                        {list.map((user) => (
                            <StyledTableRow key={user._id}>
                                <StyledTableCell>{user.username}</StyledTableCell>
                                <StyledTableCell>{user.email}</StyledTableCell>
                                <StyledTableCell>
                                    {user.roles && user.roles.length > 0 ? (
                                        user.roles.map((role) => role.name).join(', ')
                                    ) : (
                                        'Sin roles asignados'
                                    )}
                                </StyledTableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </StyledTableContainer>
        </Container>
    );
};

export default UserListWithRoles;

