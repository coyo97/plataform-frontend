// src/ui/components/stream/HomeStream.tsx

import React, { useState, useEffect } from 'react';
import JoinStream from './JoinStream';
import Stream from './Stream';
import axios from 'axios';
import getEnvVariables from '../../../config/configEnvs';
import ForgotPassword from '../auth/ForgotPassword';
import ResetPassword from '../auth/ResetPassword';

const HomeStream: React.FC = () => {
	const [userId, setUserId] = useState<string>('');
	const [streamId, setStreamId] = useState<string | null>(null);
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

	// Modificación en HomeStream.tsx
	const handleStartStream = async () => {
		const title = `Stream de ${userId}`;
		const token = localStorage.getItem('token');
		if (!token) return;

		const response = await axios.post(`${HOST}${SERVICE}/streams`, { title }, {
			headers: { Authorization: `Bearer ${token}` },
		});
		const newStreamId = response.data.stream._id;
		setStreamId(newStreamId);
	};

	const handleStopStream = async () => {
		if (!streamId) return;
		const token = localStorage.getItem('token');
		if (!token) return;

		await axios.delete(`${HOST}${SERVICE}/streams/${streamId}`, {
			headers: { Authorization: `Bearer ${token}` },
		});
		setStreamId(null);
	};

	return (
		<div>
			{!streamId ? (
				<button onClick={handleStartStream}>Iniciar Stream</button>
			) : (
				<div>
					<Stream userId={userId} streamId={streamId} isStreamer={true} />
					<button onClick={handleStopStream}>Detener Stream</button>
				</div>
			)}
			<JoinStream />
		</div>
	);
};

export default HomeStream;

