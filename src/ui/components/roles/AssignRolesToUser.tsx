import React, { useState, useEffect } from 'react';
import axios from 'axios';
import getEnvVariables from '../../../config/configEnvs';
import { MenuItem, ListItemText, InputLabel } from '@mui/material';
import {
    Container,
    Title,
    FormControlStyled,
    SelectStyled,
    CheckboxContainer,
    AssignButton
} from './assignRolesToUser.styles';


interface User {
    _id: string;
    username: string;
    email: string;
    roles: any[];
}

interface Role {
    _id: string;
    name: string;
}

const AssignRolesToUser: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const [selectedUserId, setSelectedUserId] = useState('');
    const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
    const { HOST, SERVICE } = getEnvVariables();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No se encontró el token. Por favor, inicia sesión.');
            return;
        }

        const fetchData = async () => {
            try {
                const usersResponse = await axios.get(`${HOST}${SERVICE}/users`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (usersResponse.data && usersResponse.data.users) {
                    setUsers(usersResponse.data.users);
                } else if (usersResponse.data && usersResponse.data.list) {
                    setUsers(usersResponse.data.list);
                } else {
                    console.error('La respuesta de usuarios no contiene los datos esperados.');
                }

                const rolesResponse = await axios.get(`${HOST}${SERVICE}/roles`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (rolesResponse.data && rolesResponse.data.roles) {
                    setRoles(rolesResponse.data.roles);
                } else {
                    console.error('La respuesta de roles no contiene los datos esperados.');
                }
            } catch (error) {
                console.error('Error al obtener usuarios o roles:', error);
                alert('Error al obtener datos');
            }
        };

        fetchData();
    }, [HOST, SERVICE]);

    const handleAssignRoles = async () => {
        if (!selectedUserId) {
            alert('Por favor, selecciona un usuario.');
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No se encontró el token. Por favor, inicia sesión.');
            return;
        }

        try {
            const response = await axios.put(
                `${HOST}${SERVICE}/users/${selectedUserId}/roles`,
                { roles: selectedRoles },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const updatedUser = response.data.user;
            setUsers(prevUsers =>
                prevUsers.map(user => (user._id === updatedUser._id ? updatedUser : user))
            );

            alert('Roles asignados correctamente');
        } catch (error) {
            console.error('Error al asignar roles:', error);
            alert('Error al asignar roles');
        }
    };

    return (
        <Container>
            <Title variant="h4">Asignar Roles a Usuarios</Title>
            <FormControlStyled>
                <InputLabel>Seleccionar Usuario</InputLabel>
                <SelectStyled
                    value={selectedUserId}
                    onChange={(e) => {
                        setSelectedUserId(e.target.value as string);
                        const selectedUser = users.find(user => user._id === e.target.value);
                        setSelectedRoles(selectedUser?.roles.map(role => role._id) || []);
                    }}
                >
                    <MenuItem value="">
                        <em>-- Seleccionar Usuario --</em>
                    </MenuItem>
                    {users.map(user => (
                        <MenuItem key={user._id} value={user._id}>
                            {user.username} ({user.email})
                        </MenuItem>
                    ))}
                </SelectStyled>
            </FormControlStyled>
            
            <Title variant="h5">Seleccionar Roles</Title>
            {roles.map(role => (
                <CheckboxContainer key={role._id}>
                    <input
                        type="checkbox"
                        value={role._id}
                        checked={selectedRoles.includes(role._id)}
                        onChange={(e) => {
                            const roleId = e.target.value;
                            setSelectedRoles(prev =>
                                prev.includes(roleId)
                                    ? prev.filter(id => id !== roleId)
                                    : [...prev, roleId]
                            );
                        }}
                    />
                    <ListItemText primary={role.name} />
                </CheckboxContainer>
            ))}

            <AssignButton onClick={handleAssignRoles}>Asignar Roles</AssignButton>
        </Container>
    );
};

export default AssignRolesToUser;

