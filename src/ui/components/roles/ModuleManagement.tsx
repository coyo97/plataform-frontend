import React, { useState, useEffect } from 'react';
import axios from 'axios';
import getEnvVariables from '../../../config/configEnvs';
import {
    ModuleManagementContainer,
    SectionTitle,
    InputContainer,
    ModuleList,
    ModuleItem,
    ActionButton
} from './moduleManagement.styles';
import { Box, TextField, Typography, Button } from '@mui/material';

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
        <ModuleManagementContainer>
            <SectionTitle variant="h6">Gestión de Módulos</SectionTitle>

            <Typography variant="subtitle1">Crear Nuevo Módulo</Typography>
            <InputContainer>
                <TextField
                    label="Nombre del Módulo"
                    value={newModuleName}
                    onChange={e => setNewModuleName(e.target.value)}
                    variant="outlined"
                    fullWidth
                />
                <Button variant="contained" color="primary" onClick={handleCreateModule}>
                    Crear Módulo
                </Button>
            </InputContainer>

            <Typography variant="subtitle1">Lista de Módulos</Typography>
            <ModuleList>
                {modules.map(module => (
                    <ModuleItem key={module.id}>
                        {editingModule && editingModule.id === module.id ? (
                            <Box display="flex" alignItems="center" flexGrow={1}>
                                <TextField
                                    value={editingModuleName}
                                    onChange={e => setEditingModuleName(e.target.value)}
                                    variant="outlined"
                                    fullWidth
                                />
                                <ActionButton variant="contained" color="primary" onClick={handleUpdateModule}>
                                    Guardar
                                </ActionButton>
                                <ActionButton variant="outlined" onClick={cancelEditing}>
                                    Cancelar
                                </ActionButton>
                            </Box>
                        ) : (
                            <Box display="flex" alignItems="center" flexGrow={1} justifyContent="space-between">
                                <Typography>{module.name}</Typography>
                                <Box>
                                    <ActionButton variant="contained" color="secondary" onClick={() => startEditingModule(module)}>
                                        Editar
                                    </ActionButton>
                                    <ActionButton variant="outlined" color="error" onClick={() => handleDeleteModule(module.id)}>
                                        Eliminar
                                    </ActionButton>
                                </Box>
                            </Box>
                        )}
                    </ModuleItem>
                ))}
            </ModuleList>
        </ModuleManagementContainer>
    );
};

export default ModuleManagement;

