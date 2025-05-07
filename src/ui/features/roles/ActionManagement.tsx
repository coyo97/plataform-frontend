import React, { useState, useEffect } from 'react';
import axios from 'axios';
import getEnvVariables from '../../../config/configEnvs';
import {
	ActionManagementContainer,
	Title,
	InputContainer,
	StyledInput,
	ActionButton,
	ActionList,
	ActionItem,
} from './actionManagement.styles';
import { Typography } from '@mui/material';

interface Action {
	_id: string;
	name: string;
}


const ActionManagement: React.FC = () => {
	const [actions, setActions] = useState<Action[]>([]);
	const [newActionName, setNewActionName] = useState('');
	const [editingAction, setEditingAction] = useState<Action | null>(null);
	const [editingActionName, setEditingActionName] = useState('');
	const { HOST, SERVICE } = getEnvVariables();
	const token = localStorage.getItem('token');

	useEffect(() => {
		if (!token) {
			console.error('No se encontró el token. Por favor, inicia sesión.');
			return;
		}

		const fetchActions = async () => {
			try {
				const response = await axios.get(`${HOST}${SERVICE}/actions`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				if (response.data && response.data.actions) {
					setActions(response.data.actions);
				} else {
					console.error('La respuesta no contiene las acciones esperadas.');
				}
			} catch (error) {
				console.error('Error al obtener acciones:', error);
			}
		};

		fetchActions();
	}, [HOST, SERVICE, token]);

	const handleCreateAction = async () => {
		if (!newActionName.trim()) {
			alert('El nombre de la acción no puede estar vacío.');
			return;
		}

		try {
			const response = await axios.post(
				`${HOST}${SERVICE}/actions`,
				{ name: newActionName },
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			setActions([...actions, response.data.action]);
			setNewActionName('');
		} catch (error) {
			console.error('Error al crear acción:', error);
			alert('Error al crear acción');
		}
	};

	const startEditingAction = (action: Action) => {
		setEditingAction(action);
		setEditingActionName(action.name);
	};

	const cancelEditing = () => {
		setEditingAction(null);
		setEditingActionName('');
	};

	const handleUpdateAction = async () => {
		if (!editingAction || !editingActionName.trim()) {
			alert('El nombre de la acción no puede estar vacío.');
			return;
		}

		try {
			const response = await axios.put(
				`${HOST}${SERVICE}/actions/${editingAction._id}`,
				{ name: editingActionName },
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			setActions(
				actions.map(action => (action._id === editingAction._id ? response.data.action : action))
			);
			cancelEditing();
		} catch (error) {
			console.error('Error al actualizar acción:', error);
			alert('Error al actualizar acción');
		}
	};

	const handleDeleteAction = async (id: string) => {
		if (!window.confirm('¿Estás seguro de que deseas eliminar esta acción?')) {
			return;
		}

		try {
			await axios.delete(`${HOST}${SERVICE}/actions/${id}`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			setActions(actions.filter(action => action._id !== id));
		} catch (error) {
			console.error('Error al eliminar acción:', error);
			alert('Error al eliminar acción');
		}
	};

	return (
		<ActionManagementContainer>
			<Title>Gestión de Acciones</Title>

			<InputContainer>
				<StyledInput
					type="text"
					value={newActionName}
					onChange={e => setNewActionName(e.target.value)}
					placeholder="Nombre de la Acción"
				/>
				<ActionButton onClick={handleCreateAction}>Crear Acción</ActionButton>
			</InputContainer>

			<ActionList>
				{actions.map(action => (
					<ActionItem key={action._id}>
						{editingAction && editingAction._id === action._id ? (
							<>
								<StyledInput
									type="text"
									value={editingActionName}
									onChange={e => setEditingActionName(e.target.value)}
								/>
								<ActionButton onClick={handleUpdateAction}>Guardar</ActionButton>
								<ActionButton onClick={cancelEditing}>Cancelar</ActionButton>
							</>
						) : (
							<>
								<Typography>{action.name}</Typography>
								<div>
									<ActionButton onClick={() => startEditingAction(action)}>Editar</ActionButton>
									<ActionButton onClick={() => handleDeleteAction(action._id)}>Eliminar</ActionButton>
								</div>
							</>
						)}
					</ActionItem>
				))}
			</ActionList>
		</ActionManagementContainer>
	);
};

export default ActionManagement;

