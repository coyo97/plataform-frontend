import { useEffect, useState }  from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { listViewers, kickViewer }  from '../../../../async/services/streamViewerService';
import { useSocket }               from '../../../shared/hooks/useSocket';
import { EVENTS }                  from '../../../../utils/socket/events';
import type { User }               from '../../../../types/User';

export const useStreamViewers = (streamId: string, isStreamer: boolean) => {
	const socket   = useSocket();
	const qClient  = useQueryClient();

	/*– carga inicial con REST (y refresco cada 5 s) ---------- */
	const { data: viewers = [], refetch } = useQuery<User[]>(
		['viewers', streamId],
		() => listViewers(streamId),
		{ enabled: Boolean(streamId), refetchInterval: 5000 }
	);

	/* – actualiza en tiempo real con Socket.IO ---------------- */
	useEffect(() => {
		socket.on(EVENTS.UPDATE_VIEWERS, ({ viewers }: { viewers: User[] }) => {
			// actualizamos la caché de react-query
			qClient.setQueryData(['viewers', streamId], viewers);
		});
		console.log('[VIEWERS-hook] streamId =', streamId);
		return () => { socket.off(EVENTS.UPDATE_VIEWERS); };
	}, [socket, streamId, qClient]);

	/* – expulsar espectador (REST + socket) ------------------- */
	const kick = async (viewerId: string) => {
		if (!isStreamer) return;
		await kickViewer(streamId, viewerId);
		await refetch();                // fuerza recarga de la lista
	};

	return { viewers, kick, refetch };
};

