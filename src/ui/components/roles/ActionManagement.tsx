import React, { useState, useEffect } from 'react';
import axios from 'axios';
import getEnvVariables from '../../../config/configEnvs';

interface Action {
	id: string;
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
				const response = await axios.get(`${HOST}${SERVICE}/permissions`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				if (response.data && response.data.actions) {
					setActions(response.data.actions);
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
				`${HOST}${SERVICE}/actions/${editingAction.id}`,
				{ name: editingActionName },
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			setActions(
				actions.map(action =>
							action.id === editingAction.id ? response.data.action : action
						   )
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
			setActions(actions.filter(action => action.id !== id));
		} catch (error) {
			console.error('Error al eliminar acción:', error);
			alert('Error al eliminar acción');
		}
	};

	return (
		<div>
			<h2>Gestión de Acciones</h2>
			{/* Formulario para crear nueva acción */}
			<div>
				<h3>Crear Nueva Acción</h3>
				<input
					type="text"
					value={newActionName}
					onChange={e => setNewActionName(e.target.value)}
					placeholder="Nombre de la Acción"
				/>
				<button onClick={handleCreateAction}>Crear Acción</button>
			</div>

			{/* Lista de acciones */}
			<div>
				<h3>Lista de Acciones</h3>
				<ul>
					{actions.map(action => (
						<li key={action.id}>
							{editingAction && editingAction.id === action.id ? (
								// Modo edición
								<div>
									<input
										type="text"
										value={editingActionName}
										onChange={e => setEditingActionName(e.target.value)}
									/>
									<button onClick={handleUpdateAction}>Guardar</button>
									<button onClick={cancelEditing}>Cancelar</button>
								</div>
							) : (
							// Modo visualización
							<div>
								{action.name}
								<button onClick={() => startEditingAction(action)}>Editar</button>
								<button onClick={() => handleDeleteAction(action.id)}>Eliminar</button>
							</div>
							)}
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};

export default ActionManagement;

