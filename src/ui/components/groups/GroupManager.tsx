// src/ui/components/groups/GroupManager.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import getEnvVariables from '../../../config/configEnvs';

// Definir el tipo para los grupos
interface Group {
    _id: string;
    name: string;
    description: string;
}

const GroupManager: React.FC = () => {
    const [groups, setGroups] = useState<Group[]>([]); // Estado con tipo Group[]
    const [groupName, setGroupName] = useState<string>(''); // Tipo string para el nombre del grupo
    const [description, setDescription] = useState<string>(''); // Tipo string para la descripción
    const { HOST, SERVICE } = getEnvVariables();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No se encontró el token en el localStorage');
            return;
        }

        axios.get(`${HOST}${SERVICE}/groups`, {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then(response => setGroups(response.data.groups))
        .catch(error => console.error('Error fetching groups:', error));
    }, [HOST, SERVICE]);

    const handleCreateGroup = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No se encontró el token en el localStorage');
            return;
        }

        axios.post(`${HOST}${SERVICE}/groups/create`, {
            name: groupName,
            description,
        }, {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then(response => setGroups([...groups, response.data.group]))
        .catch(error => console.error('Error creating group:', error));
    };

	const handleJoinGroup = (groupId: string) => {
    const token = localStorage.getItem('token');
    axios.post(`${HOST}${SERVICE}/groups/${groupId}/join`, {}, {
        headers: { Authorization: `Bearer ${token}` },
    })
    .then(response => {
        console.log('Te has unido al grupo:', response.data.group);
        // Aquí puedes hacer algo más, como actualizar la lista de grupos
    })
    .catch(error => console.error('Error al unirse al grupo:', error));
};


    return (
		 <div>
        <h2>Gestión de Grupos</h2>
        <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Nombre del grupo"
        />
        <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descripción del grupo"
        />
        <button onClick={handleCreateGroup}>Crear Grupo</button>
        <ul>
            {groups.map((group) => (
                <li key={group._id}>
                    {group.name}
                    <button onClick={() => handleJoinGroup(group._id)}>Unirse</button>
                </li>
            ))}
        </ul>
    </div>
    );
};

export default GroupManager;

