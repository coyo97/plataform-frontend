import React, { useState, useEffect } from 'react';
import axios from 'axios';
import getEnvVariables from '../../../config/configEnvs';
import Stream from './Stream';

interface StreamRoom {
	_id: string;
	title: string;
	userId: string;
	visibility: 'university' | 'career' | 'private';
}

const JoinStream: React.FC = () => {
	const [streams, setStreams] = useState<StreamRoom[]>([]);
	const [selectedStream, setSelectedStream] = useState<StreamRoom | null>(null);
	const [userId, setUserId] = useState<string>('');
	const [accessCode, setAccessCode] = useState<string>('');
	const { HOST, SERVICE } = getEnvVariables();

	useEffect(() => {
		const token = localStorage.getItem('token');
		if (!token) return;

		const fetchUserId = async () => {
			const response = await axios.get(`${HOST}${SERVICE}/users/me`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			setUserId(response.data.userId);
		};

		fetchUserId();
	}, []);

	const fetchStreams = async () => {
		const response = await axios.get(`${HOST}${SERVICE}/streams`, {
			headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
		});
		const activeStreams = response.data.streams.filter((stream: any) => stream.active);
		setStreams(activeStreams);
	};

	useEffect(() => {
		fetchStreams();
		// Actualizar la lista de streams cada 5 segundos
		const interval = setInterval(() => {
			fetchStreams();
		}, 5000);

		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		const joinedStreamId = localStorage.getItem('joinedStreamId');
		const isViewer = localStorage.getItem('isViewer');
		const savedAccessCode = localStorage.getItem('accessCode');

		if (joinedStreamId && isViewer === 'true') {
			// Buscar el stream en la lista de streams
			const stream = streams.find(s => s._id === joinedStreamId);
			if (stream) {
				setSelectedStream(stream);
				setAccessCode(savedAccessCode || '');
			}
		}
	}, [streams]);


	const handleJoinStream = (stream: StreamRoom) => {
		if (stream.visibility === 'private') {
			const code = prompt('Este stream es privado. Por favor, ingresa el código de acceso:');
			if (code) {
				setAccessCode(code.trim());
				setSelectedStream(stream);
				// Guardar en localStorage
				localStorage.setItem('joinedStreamId', stream._id);
				localStorage.setItem('isViewer', 'true');
				localStorage.setItem('accessCode', code.trim());
			}
		} else {
			setAccessCode('');
			setSelectedStream(stream);
			// Guardar en localStorage
			localStorage.setItem('joinedStreamId', stream._id);
			localStorage.setItem('isViewer', 'true');
		}
	};
	const handleLeaveStream = () => {
		setSelectedStream(null);
		setAccessCode('');

		// Limpiar localStorage
		localStorage.removeItem('joinedStreamId');
		localStorage.removeItem('isViewer');
		localStorage.removeItem('accessCode');
	};

	return (
		<div>
			<h1>Unirse a un Stream</h1>
			{streams.length === 0 ? (
				<p>No hay streams disponibles en este momento.</p>
			) : (
			streams.map((stream) => (
				<div key={stream._id}>
					<p>{stream.title} (Visibilidad: {stream.visibility})</p>
					<button onClick={() => handleJoinStream(stream)}>Unirse al stream</button>
				</div>
			))
			)}
			{selectedStream && (
				<Stream
					userId={userId}
					streamId={selectedStream._id}
					isStreamer={false}
					accessCode={accessCode}
					onLeaveStream={handleLeaveStream}
				/>
			)}
		</div>
	)
};

export default JoinStream;

