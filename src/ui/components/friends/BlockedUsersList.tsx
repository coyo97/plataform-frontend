// src/ui/components/blocked/BlockedUsersList.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import getEnvVariables from '../../../config/configEnvs';
import {
    BlockedUsersContainer,
    Title,
    BlockedList,
    BlockedUserItem,
    UserName,
    UnblockButton,
} from './blockedUsersListStyles.styles';

interface User {
    _id: string;
    username: string;
    email: string;
}

const BlockedUsersList: React.FC = () => {
    const [blockedUsers, setBlockedUsers] = useState<User[]>([]);
    const { HOST, SERVICE } = getEnvVariables();
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchBlockedUsers = async () => {
            try {
                const response = await axios.get(`${HOST}${SERVICE}/users/blocked-users`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (response.data && response.data.blockedUsers) {
                    setBlockedUsers(response.data.blockedUsers);
                } else {
                    console.error('La respuesta no contiene la lista de usuarios bloqueados esperada.');
                }
            } catch (error) {
                console.error('Error al obtener la lista de usuarios bloqueados:', error);
            }
        };
        fetchBlockedUsers();
    }, [HOST, SERVICE, token]);

    const unblockUser = async (userId: string) => {
        try {
            await axios.post(`${HOST}${SERVICE}/users/${userId}/unblock`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setBlockedUsers((prevList) => prevList.filter((user) => user._id !== userId));
            alert('Usuario desbloqueado');
        } catch (error) {
            console.error('Error al desbloquear al usuario:', error);
            alert('Error al desbloquear al usuario');
        }
    };

    return (
        <BlockedUsersContainer>
            <Title variant="h5">Usuarios Bloqueados</Title>
            <BlockedList>
                {blockedUsers.map((user) => (
                    <BlockedUserItem key={user._id}>
                        <UserName>{user.username}</UserName>
                        <UnblockButton onClick={() => unblockUser(user._id)}>
                            Desbloquear usuario
                        </UnblockButton>
                    </BlockedUserItem>
                ))}
            </BlockedList>
        </BlockedUsersContainer>
    );
};

export default BlockedUsersList;

