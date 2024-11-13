import React, { useState, useEffect } from 'react';
import axios from 'axios';
import getEnvVariables from '../../../config/configEnvs';
import { Box, Button, TextField, Typography, List, ListItem } from '@mui/material';
import { styled } from '@mui/system';

interface Group {
	_id: string;
	name: string;
	description: string;
}

const GroupContainer = styled(Box)(({ theme }) => ({
	padding: theme.spacing(4),
	backgroundColor: theme.palette.background.paper,
	borderRadius: theme.shape.borderRadius,
	maxWidth: '600px',
	margin: 'auto',
}));

const StyledInput = styled(TextField)(({ theme }) => ({
	marginBottom: theme.spacing(2),
	width: '100%',
}));

const GroupList = styled(List)(({ theme }) => ({
	marginTop: theme.spacing(2),
	border: `1px solid ${theme.palette.divider}`,
	borderRadius: theme.shape.borderRadius,
}));

const GroupItem = styled(ListItem)(({ theme }) => ({
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
	padding: theme.spacing(2),
	borderBottom: `1px solid ${theme.palette.divider}`,
	'&:last-child': {
		borderBottom: 'none',
	},
}));

const GroupManager: React.FC = () => {
	const [groups, setGroups] = useState<Group[]>([]);
	const [groupName, setGroupName] = useState<string>('');
	const [description, setDescription] = useState<string>('');
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
			// Actualizar la lista de grupos u otras acciones
		})
		.catch(error => console.error('Error al unirse al grupo:', error));
	};

	return (
		<GroupContainer>
			<Typography variant="h4" gutterBottom>
				Gestión de Grupos
			</Typography>
			<StyledInput
				label="Nombre del grupo"
				variant="outlined"
				value={groupName}
				onChange={(e) => setGroupName(e.target.value)}
			/>
			<StyledInput
				label="Descripción del grupo"
				variant="outlined"
				value={description}
				onChange={(e) => setDescription(e.target.value)}
			/>
			<Button
				variant="contained"
				color="primary"
				onClick={handleCreateGroup}
				sx={{ mb: 3, width: '100%' }}
			>
				Crear Grupo
			</Button>
			<GroupList>
				{groups.map((group) => (
					<GroupItem key={group._id}>
						<Typography variant="body1">{group.name}</Typography>
						<Button
							variant="outlined"
							color="primary"
							onClick={() => handleJoinGroup(group._id)}
						>
							Unirse
						</Button>
					</GroupItem>
				))}
			</GroupList>
		</GroupContainer>
	);
};

export default GroupManager;

