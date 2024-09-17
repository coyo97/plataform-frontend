// src/ui/components/careers/CareerManager.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import getEnvVariables from '../../../config/configEnvs';

interface Career {
    _id: string;
    name: string;
    description?: string;
}

const CareerManager: React.FC = () => {
    const [careers, setCareers] = useState<Career[]>([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);

	const {HOST, SERVICE} = getEnvVariables();

    useEffect(() => {
        fetchCareers();
    }, []);

    const fetchCareers = async () => {
        try {
            const response = await axios.get(`${HOST}${SERVICE}/careers`);
            setCareers(response.data.careers);
        } catch (error) {
            console.error('Error fetching careers:', error);
        }
    };

    const handleCreateOrUpdateCareer = async () => {
        try {
            const token = localStorage.getItem('token'); // Obtén el token del localStorage
            const headers = {
                Authorization: `Bearer ${token}`, // Añade el token al encabezado
            };

            if (selectedCareer) {
                // Actualizar una carrera existente
                await axios.put(
                    `${HOST}{SERVICE}/careers/${selectedCareer._id}`,
                    { name, description },
                    { headers }
                );
                alert('Carrera actualizada con éxito');
            } else {
                // Crear una nueva carrera
                await axios.post(
                    `${HOST}${SERVICE}/careers`,
                    { name, description },
                    { headers }
                );
                alert('Carrera creada con éxito');
            }
            setName('');
            setDescription('');
            setSelectedCareer(null);
            fetchCareers();
        } catch (error) {
            console.error('Error al crear o actualizar carrera:', error);
        }
    };

    const handleDeleteCareer = async (id: string) => {
        try {
            const token = localStorage.getItem('token'); // Obtén el token del localStorage
            await axios.delete(`${HOST}${SERVICE}/careers/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Añade el token al encabezado
                },
            });
            alert('Carrera eliminada con éxito');
            fetchCareers();
        } catch (error) {
            console.error('Error al eliminar la carrera:', error);
        }
    };

    const handleEditCareer = (career: Career) => {
        setSelectedCareer(career);
        setName(career.name);
        setDescription(career.description || '');
    };

    return (
        <div>
            <h2>Gestión de Carreras</h2>
            <input
                type="text"
                placeholder="Nombre de la carrera"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <textarea
                placeholder="Descripción"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <button onClick={handleCreateOrUpdateCareer}>
                {selectedCareer ? 'Actualizar Carrera' : 'Crear Carrera'}
            </button>
            <ul>
                {careers.map(career => (
                    <li key={career._id}>
                        <span>{career.name} - {career.description}</span>
                        <button onClick={() => handleEditCareer(career)}>Editar</button>
                        <button onClick={() => handleDeleteCareer(career._id)}>Eliminar</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CareerManager;

