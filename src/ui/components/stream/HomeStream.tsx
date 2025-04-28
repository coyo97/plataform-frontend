import React, { useState, useEffect } from 'react';
import JoinStream from './JoinStream';
import Stream from './Stream';
import axios from 'axios';
import getEnvVariables from '../../../config/configEnvs';

const HomeStream: React.FC = () => {
	const [userId, setUserId] = useState<string>('');
	const [streamId, setStreamId] = useState<string | null>(null);
	const [title, setTitle] = useState<string>('Mi Stream');
	const [visibility, setVisibility] = useState<'university' | 'career' | 'private'>('university');
	const [careers, setCareers] = useState<any[]>([]);
	const [careerIds, setCareerIds] = useState<string[]>([]);
	const [accessCode, setAccessCode] = useState<string>('');
	const { HOST, SERVICE } = getEnvVariables();
	const [isStreamer, setIsStreamer] = useState<boolean>(false);

	useEffect(() => {
		const token = localStorage.getItem('token');
		if (!token) return;

		const fetchUserId = async () => {
			const response = await axios.get(`${HOST}${SERVICE}/users/me`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			setUserId(response.data.userId);
		};

		const fetchCareers = async () => {
			const response = await axios.get(`${HOST}${SERVICE}/careers`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			setCareers(response.data.careers);
		};

		fetchUserId();
		fetchCareers();
		// Verificar si hay un stream activo
		const savedStreamId = localStorage.getItem('activeStreamId');
		const savedIsStreamer = localStorage.getItem('isStreamer');

		if (savedStreamId && savedIsStreamer === 'true') {
			setStreamId(savedStreamId);
			setIsStreamer(true);
			// Si tienes el accessCode guardado, también puedes restaurarlo
			const savedAccessCode = localStorage.getItem('accessCode');
			if (savedAccessCode) {
				setAccessCode(savedAccessCode);
			}
		}
	}, []);

	const handleStartStream = async () => {
		const token = localStorage.getItem('token');
		if (!token) return;

		const streamData: any = {
			title,
			visibility,
		};

		if (visibility === 'career' && careerIds.length > 0) {
			streamData.careerIds = careerIds;
		}

		try {
			const response = await axios.post(`${HOST}${SERVICE}/streams`, streamData, {
				headers: { Authorization: `Bearer ${token}` },
			});
			const newStreamId = response.data.stream._id;
			setStreamId(newStreamId);
			setIsStreamer(true);

			// Guardar en localStorage
			localStorage.setItem('activeStreamId', newStreamId);
			localStorage.setItem('isStreamer', 'true')

			if (visibility === 'private' && response.data.accessCode) {
				console.log('Código de acceso recibido del backend:', response.data.accessCode);
				setAccessCode(response.data.accessCode);
			}
		} catch (error) {
			console.error('Error al crear el stream:', error);
		}
	};

	const handleStopStream = async () => {
		if (!streamId) return;
		const token = localStorage.getItem('token');
		if (!token) return;

		await axios.delete(`${HOST}${SERVICE}/streams/${streamId}`, {
			headers: { Authorization: `Bearer ${token}` },
		});
		setStreamId(null);
		setAccessCode('');
		setIsStreamer(false);

		// Limpiar localStorage
		localStorage.removeItem('activeStreamId');
		localStorage.removeItem('isStreamer');
		localStorage.removeItem('accessCode');
	};

	return (
		<div>
			{!streamId ? (
				<div>
					<h2>Crear un nuevo Stream</h2>
					<form onSubmit={(e) => { e.preventDefault(); handleStartStream(); }}>
						<div>
							<label>Título:</label>
							<input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
						</div>
						<div>
							<label>Visibilidad:</label>
							<select value={visibility} onChange={(e) => setVisibility(e.target.value as any)}>
								<option value="university">Universidad</option>
								<option value="career">Carrera</option>
								<option value="private">Privado (con código)</option>
							</select>
						</div>
						{visibility === 'career' && (
							<div>
								<label>Carreras:</label>
								<select multiple value={careerIds} onChange={(e) => {
									const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
									setCareerIds(selectedOptions);
								}}>
									{careers.map((career) => (
										<option key={career._id} value={career._id}>{career.name}</option>
									))}
								</select>
							</div>
						)}
						<button type="submit">Iniciar Stream</button>
					</form>
				</div>
			) : (
				<div>
					<Stream userId={userId} streamId={streamId} isStreamer={isStreamer} accessCode={accessCode} />
					<button onClick={handleStopStream}>Detener Stream</button>
				</div>
			)}

			{/* Mostrar el código de acceso independientemente del estado de streamId */}
			{visibility === 'private' && accessCode && (
				<div>
					<p>Código de acceso:</p>
					<input type="text" value={accessCode} readOnly />
					<button onClick={() => navigator.clipboard.writeText(accessCode)}>Copiar Código</button>
				</div>
			)}
			{/* Renderizar JoinStream solo si no hay un stream activo */}
			{!streamId && <JoinStream />}
		</div>
	);
};

export default HomeStream;

