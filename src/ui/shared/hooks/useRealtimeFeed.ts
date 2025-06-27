import { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import { useSocket } from './useSocket';

export type RegisterFn<T> = (
	socket: Socket,
	setItems: React.Dispatch<React.SetStateAction<T[]>>
) => () => void;
/**
 * Abstrae: 1) carga inicial  2) subscripción a eventos de socket
 */
export function useRealtimeFeed<T>(
	fetchInitial: () => Promise<T[]>,
	registerEvents: RegisterFn<T>
) {
	const [items, setItems] = useState<T[]>([]);
	const socket = useSocket();

	// 1) carga inicial
	useEffect(() => { fetchInitial().then(setItems).catch(console.error); }, []);

	// 2) socket   AHORA sí devolvemos el cleanup
	useEffect(() => {
		if (!socket) return;                     // socket aún no listo
		const cleanup = registerEvents(socket, setItems);
		return cleanup;                          // <- muy importante
	}, [socket]);

	return [items, setItems] as const;
}

