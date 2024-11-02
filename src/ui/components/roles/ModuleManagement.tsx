import React, { useState, useEffect } from 'react';
import axios from 'axios';
import getEnvVariables from '../../../config/configEnvs';

interface Module {
	id: string;
	name: string;
}

const ModuleManagement: React.FC = () => {
	const [modules, setModules] = useState<Module[]>([]);
	const [newModuleName, setNewModuleName] = useState('');
	const [editingModule, setEditingModule] = useState<Module | null>(null);
	const [editingModuleName, setEditingModuleName] = useState('');
	const { HOST, SERVICE } = getEnvVariables();
	const token = localStorage.getItem('token');

	useEffect(() => {
		if (!token) {
			console.error('No se encontró el token. Por favor, inicia sesión.');
			return;
		}

		const fetchModules = async () => {
			try {
				const response = await axios.get(`${HOST}${SERVICE}/permissions`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				if (response.data && response.data.modules) {
					setModules(response.data.modules);
				}
			} catch (error) {
				console.error('Error al obtener módulos:', error);
			}
		};

		fetchModules();
	}, [HOST, SERVICE, token]);

	const handleCreateModule = async () => {
		if (!newModuleName.trim()) {
			alert('El nombre del módulo no puede estar vacío.');
			return;
		}

		try {
			const response = await axios.post(
				`${HOST}${SERVICE}/modules`,
				{ name: newModuleName },
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			setModules([...modules, response.data.module]);
			setNewModuleName('');
		} catch (error) {
			console.error('Error al crear módulo:', error);
			alert('Error al crear módulo');
		}
	};

	const startEditingModule = (module: Module) => {
		setEditingModule(module);
		setEditingModuleName(module.name);
	};

	const cancelEditing = () => {
		setEditingModule(null);
		setEditingModuleName('');
	};

	const handleUpdateModule = async () => {
		if (!editingModule || !editingModuleName.trim()) {
			alert('El nombre del módulo no puede estar vacío.');
			return;
		}

		try {
			const response = await axios.put(
				`${HOST}${SERVICE}/modules/${editingModule.id}`,
				{ name: editingModuleName },
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			setModules(
				modules.map(module =>
							module.id === editingModule.id ? response.data.module : module
						   )
			);
			cancelEditing();
		} catch (error) {
			console.error('Error al actualizar módulo:', error);
			alert('Error al actualizar módulo');
		}
	};

	const handleDeleteModule = async (id: string) => {
		if (!window.confirm('¿Estás seguro de que deseas eliminar este módulo?')) {
			return;
		}

		try {
			await axios.delete(`${HOST}${SERVICE}/modules/${id}`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			setModules(modules.filter(module => module.id !== id));
		} catch (error) {
			console.error('Error al eliminar módulo:', error);
			alert('Error al eliminar módulo');
		}
	};

	return (
		<div>
			<h2>Gestión de Módulos</h2>
			{/* Formulario para crear nuevo módulo */}
			<div>
				<h3>Crear Nuevo Módulo</h3>
				<input
					type="text"
					value={newModuleName}
					onChange={e => setNewModuleName(e.target.value)}
					placeholder="Nombre del Módulo"
				/>
				<button onClick={handleCreateModule}>Crear Módulo</button>
			</div>

			{/* Lista de módulos */}
			<div>
				<h3>Lista de Módulos</h3>
				<ul>
					{modules.map(module => (
						<li key={module.id}>
							{editingModule && editingModule.id === module.id ? (
								// Modo edición
								<div>
									<input
										type="text"
										value={editingModuleName}
										onChange={e => setEditingModuleName(e.target.value)}
									/>
									<button onClick={handleUpdateModule}>Guardar</button>
									<button onClick={cancelEditing}>Cancelar</button>
								</div>
							) : (
							// Modo visualización
							<div>
								{module.name}
								<button onClick={() => startEditingModule(module)}>Editar</button>
								<button onClick={() => handleDeleteModule(module.id)}>Eliminar</button>
							</div>
							)}
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};

export default ModuleManagement;

