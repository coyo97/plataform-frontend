import React, { useState, useEffect } from 'react';
import axios from 'axios';
import getEnvVariables from '../../../config/configEnvs';

interface Permission {
	module: string;
	action: string;
}

const CreateRole: React.FC = () => {
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [permissions, setPermissions] = useState<Permission[]>([]);
	const [modules, setModules] = useState<{ id: string; name: string }[]>([]);
	const [actions, setActions] = useState<{ id: string; name: string }[]>([]);
	const [selectedModule, setSelectedModule] = useState('');
	const [selectedAction, setSelectedAction] = useState('');
	const { HOST, SERVICE } = getEnvVariables();

	useEffect(() => {
		const token = localStorage.getItem('token');
		if (!token) {
			console.error('No se encontró el token. Por favor, inicia sesión.');
			return;
		}

		const fetchPermissions = async () => {
			try {
				const response = await axios.get(`${HOST}${SERVICE}/permissions`, {
					headers: { Authorization: `Bearer ${token}` },
				});

				if (response.data) {
					setModules(response.data.modules);
					setActions(response.data.actions);
				} else {
					console.error('La respuesta no contiene los datos esperados.');
				}
			} catch (error) {
				console.error('Error al obtener permisos:', error);
			}
		};

		fetchPermissions();
	}, [HOST, SERVICE]);

	const addPermission = () => {
		if (selectedModule && selectedAction) {
			setPermissions([...permissions, { module: selectedModule, action: selectedAction }]);
			setSelectedModule('');
			setSelectedAction('');
		}
	};

	const removePermission = (index: number) => {
		setPermissions(permissions.filter((_, i) => i !== index));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const token = localStorage.getItem('token');
		if (!token) {
			alert('No se encontró el token. Por favor, inicia sesión.');
			return;
		}

		try {
			await axios.post(
				`${HOST}${SERVICE}/roles`,
				{ name, description, permissions },
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			alert('Rol creado exitosamente');
			setName('');
			setDescription('');
			setPermissions([]);
		} catch (error) {
			console.error('Error al crear rol:', error);
			alert('Error al crear rol');
		}
	};

	return (
		<div>
			<h2>Crear Nuevo Rol</h2>
			<form onSubmit={handleSubmit}>
				<div>
					<label>Nombre del Rol:</label>
					<input
						type="text"
						value={name}
						onChange={e => setName(e.target.value)}
						required
					/>
				</div>
				<div>
					<label>Descripción:</label>
					<textarea
						value={description}
						onChange={e => setDescription(e.target.value)}
					/>
				</div>
				<div>
					<h3>Permisos:</h3>
					<div>
						<label>Módulo:</label>
						<select value={selectedModule} onChange={e => setSelectedModule(e.target.value)}>
							<option value="">-- Seleccionar Módulo --</option>
							{modules.map(module => (
								<option key={module.id} value={module.name}>{module.name}</option>
							))}
						</select>
					</div>
					<div>
						<label>Acción:</label>
						<select value={selectedAction} onChange={e => setSelectedAction(e.target.value)}>
							<option value="">-- Seleccionar Acción --</option>
							{actions.map(action => (
								<option key={action.id} value={action.name}>{action.name}</option>
							))}
						</select>
					</div>
					<button type="button" onClick={addPermission}>Agregar Permiso</button>
					<ul>
						{permissions.map((perm, index) => (
							<li key={index}>
								{perm.module} - {perm.action}
								<button type="button" onClick={() => removePermission(index)}>Eliminar</button>
							</li>
						))}
					</ul>
				</div>
				<button type="submit">Crear Rol</button>
			</form>
		</div>
	);
};

export default CreateRole;

