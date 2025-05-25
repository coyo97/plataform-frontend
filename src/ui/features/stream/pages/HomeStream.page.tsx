// src/ui/features/stream/pages/HomeStream.page.tsx
import React, { useState, useEffect } from 'react';
import HomeStreamLayout from '../templates/HomeStreamLayout';
import * as streamApi from '../../../../async/services/streamService';
import StreamActiveLayout from '../templates/StreamActiveLayout';
import StreamList from '../organisms/StreamList';
import type { Stream } from '../../../../types/stream';
import { useAuth } from '../../../shared/hooks/useAuth';


const HomeStreamPage: React.FC = () => {
	const [streamId, setStreamId] = useState<string | null>(null);
	const [isStreamer, setIsStreamer] = useState<boolean>(false);
	const [accessCode, setAccessCode] = useState<string | undefined>();

	useEffect(() => {
		// restablecer estado desde localStorage
		const savedStreamId   = localStorage.getItem('activeStreamId');
		const savedJoinedId   = localStorage.getItem('joinedStreamId');
		const savedIsStreamer = localStorage.getItem('isStreamer') === 'true';
		const savedIsViewer   = localStorage.getItem('isViewer')   === 'true';
		const savedAccessCode = localStorage.getItem('accessCode') ?? undefined;

		if (savedStreamId && savedIsStreamer) {
			setStreamId(savedStreamId);
			setIsStreamer(true);
			setAccessCode(savedAccessCode);
		} else if (savedJoinedId && savedIsViewer) {
			/* intenta reconectar como viewer */
			streamApi.join(savedJoinedId, savedAccessCode)
			.then(() => {
				setStreamId(savedJoinedId);
				setIsStreamer(false);
				setAccessCode(savedAccessCode);
			})
			.catch(() => {
				// token caducó o stream finalizado → limpia storage
				localStorage.removeItem('joinedStreamId');
				localStorage.removeItem('isViewer');
				localStorage.removeItem('accessCode');
			});
		}
	}, []);

	const handleEnd = () => {
		if (streamId && isStreamer) {
			// avisa al backend que el stream terminó (soft-delete)
			streamApi.stop(streamId).catch(console.error);
		}
		/* siempre limpia localStorage — tanto streamer como viewer */
		localStorage.removeItem('activeStreamId');
		localStorage.removeItem('joinedStreamId');
		localStorage.removeItem('isStreamer');
		localStorage.removeItem('isViewer');
		localStorage.removeItem('accessCode');

		/* limpieza de estado/frontend */
		setStreamId(null);
		setIsStreamer(false);
		setAccessCode(undefined);

	};
	// ───────── unir a stream seleccionado ─────────
	const handleJoin = async (stream: Stream) => {
		let code: string | undefined = undefined;
		if (stream.visibility === 'private') {
			code = prompt('Este stream es privado. Ingresa el código de acceso:') ?? undefined;
			if (!code) return;                 // cancelado
		}
		try {
			await streamApi.join(stream._id, code);
			setStreamId(stream._id);
			setIsStreamer(false);
			setAccessCode(code);

			localStorage.setItem('joinedStreamId', stream._id);
			localStorage.setItem('isViewer', 'true');
			if (code) localStorage.setItem('accessCode', code);
		} catch (err) {
			alert('No se pudo unir al stream');   // mensajes más finos si quieres
			console.error(err);
		}
	};
	/* callback que recibiremos desde el formulario */
	const handleStreamCreated = (id: string, code?: string) => {
		setStreamId(id);
		setIsStreamer(true);
		setAccessCode(code);
		localStorage.setItem('activeStreamId', id);
		localStorage.setItem('isStreamer', 'true');
		if (code) localStorage.setItem('accessCode', code);
	};
	return (
		<HomeStreamLayout onStreamCreated={handleStreamCreated} onStreamSelected={handleJoin}>

			{streamId                    // ← sólo si hay streamId
				? (
					<StreamActiveLayout
						streamId={streamId}
						isStreamer={isStreamer}
						accessCode={accessCode}
						onStreamEnd={handleEnd}
					/>
				)
				: null}
		</HomeStreamLayout>
	);
};

export default HomeStreamPage;

