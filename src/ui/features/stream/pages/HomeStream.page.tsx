import React, { useState, useEffect } from 'react'
import HomeStreamLayout from '../templates/HomeStreamLayout';
import * as streamApi from '../../../../async/services/streamService';
import StreamActiveLayout from '../templates/StreamActiveLayout';
import type { Stream } from '../../../../types/stream';
import { useAuth } from '../../../shared/hooks/useAuth';

const HomeStreamPage: React.FC = () => {
	const [streamId, setStreamId] = useState<string | null>(null);
	const [isStreamer, setIsStreamer] = useState<boolean>(false);
	const [accessCode, setAccessCode] = useState<string | undefined>();
	const [activeStream, setActiveStream] = useState<Stream | null>(null); 

	useEffect(() => {
		// restablecer estado desde localStorage
		const savedStreamId   = localStorage.getItem('activeStreamId');
		const savedJoinedId   = localStorage.getItem('joinedStreamId');
		const savedIsStreamer = localStorage.getItem('isStreamer') === 'true';
		const savedIsViewer   = localStorage.getItem('isViewer') === 'true';
		const savedAccessCode = localStorage.getItem('accessCode') ?? undefined;

		if (savedStreamId && savedIsStreamer) {
			setStreamId(savedStreamId);
			setIsStreamer(true);
			setAccessCode(savedAccessCode);
		} else if (savedJoinedId && savedIsViewer) {
			streamApi.join(savedJoinedId, savedAccessCode)
			.then(() => {
				setStreamId(savedJoinedId);
				setIsStreamer(false);
				setAccessCode(savedAccessCode);
			})
			.catch(() => {
				localStorage.removeItem('joinedStreamId');
				localStorage.removeItem('isViewer');
				localStorage.removeItem('accessCode');
			});
		}
	}, []);

	const handleEnd = () => {
		if (streamId && isStreamer) {
			streamApi.stop(streamId).catch(console.error);
		}
		localStorage.removeItem('activeStreamId');
		localStorage.removeItem('joinedStreamId');
		localStorage.removeItem('isStreamer');
		localStorage.removeItem('isViewer');
		localStorage.removeItem('accessCode');

		setStreamId(null);
		setIsStreamer(false);
		setAccessCode(undefined);
		setActiveStream(null); 
	};

	const handleJoin = async (stream: Stream) => {
		let code: string | undefined = undefined;
		if (stream.visibility === 'private') {
			code = prompt('Este stream es privado. Ingresa el código de acceso:') ?? undefined;
			if (!code) return;
		}
		try {
			await streamApi.join(stream._id, code);
			setStreamId(stream._id);
			setIsStreamer(false);
			setAccessCode(code);
			setActiveStream(stream); 

			localStorage.setItem('joinedStreamId', stream._id);
			localStorage.setItem('isViewer', 'true');
			if (code) localStorage.setItem('accessCode', code);
		} catch (err) {
			alert('No se pudo unir al stream');
			console.error(err);
		}
	};

	/* callback desde el formulario */
	const handleStreamCreated = (id: string, code?: string, stream?: Stream) => {
		setStreamId(id);
		setIsStreamer(true);
		setAccessCode(code);
		setActiveStream(stream ?? null);
		localStorage.setItem('activeStreamId', id);
		localStorage.setItem('isStreamer', 'true');
		if (code) localStorage.setItem('accessCode', code);
	};

	return (
		<HomeStreamLayout
			onStreamCreated={handleStreamCreated}
			onStreamSelected={handleJoin}
		>
			{streamId && (
				<StreamActiveLayout
					streamId={streamId}
					isStreamer={isStreamer}
					stream={activeStream ?? undefined} 
					accessCode={accessCode}
					onStreamEnd={handleEnd}
				/>
			)}
		</HomeStreamLayout>
	);
};

export default HomeStreamPage;

