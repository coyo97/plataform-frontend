import React, { useState, useEffect } from 'react';
import axios from 'axios';
import getEnvVariables from '../../../config/configEnvs';
import {
	Container,
	Title,
	Input,
	Textarea,
	Button,
	CareerList,
	CareerItem,
	CareerName,
	ActionButton,
} from './careerManagerStyles';

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

	const { HOST, SERVICE } = getEnvVariables();

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
			const token = localStorage.getItem('token');
			const headers = { Authorization: `Bearer ${token}` };

			if (selectedCareer) {
				await axios.put(
					`${HOST}${SERVICE}/careers/${selectedCareer._id}`,
					{ name, description },
					{ headers }
				);
				alert('Carrera actualizada con éxito');
			} else {
				await axios.post(`${HOST}${SERVICE}/careers`, { name, description }, { headers });
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
			const token = localStorage.getItem('token');
			await axios.delete(`${HOST}${SERVICE}/careers/${id}`, {
				headers: { Authorization: `Bearer ${token}` },
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
		<Container>
			<Title>Gestión de Carreras</Title>
			<Input
				type="text"
				placeholder="Nombre de la carrera"
				value={name}
				onChange={(e) => setName(e.target.value)}
			/>
			<Textarea
				placeholder="Descripción"
				value={description}
				onChange={(e) => setDescription(e.target.value)}
			/>
			<Button onClick={handleCreateOrUpdateCareer}>
				{selectedCareer ? 'Actualizar Carrera' : 'Crear Carrera'}
			</Button>
			<CareerList>
				{careers.map((career) => (
					<CareerItem key={career._id}>
						<CareerName>
							{career.name} - {career.description}
						</CareerName>
						<div>
							<ActionButton onClick={() => handleEditCareer(career)}>Editar</ActionButton>
							<ActionButton onClick={() => handleDeleteCareer(career._id)}>Eliminar</ActionButton>
						</div>
					</CareerItem>
				))}
			</CareerList>
		</Container>
	);
};

export default CareerManager;

