import { useState, useEffect } from 'react';
import {
	fetchFriendRequests,
	acceptFriendRequest,
	rejectFriendRequest,
} from '../../../../async/services/friendService';
import type { UserProfile } from '../../../../types/profile';

export const useFriendRequests = () => {
	const [list, setList] = useState<UserProfile[]>([]);
	const [message, setMsg] = useState('');

	useEffect(() => {
		fetchFriendRequests()
		.then(setList)
		.catch(() => setMsg('No se pudo obtener las solicitudes'));
	}, []);

	const accept = async (id: string) => {
		try {
			await acceptFriendRequest(id);
			setList(list.filter(r => r._id !== id));
			setMsg('Solicitud aceptada');
		} catch {
			setMsg('Error al aceptar');
		}
	};

	const reject = async (id: string) => {
		try {
			await rejectFriendRequest(id);
			setList(list.filter(r => r._id !== id));
			setMsg('Solicitud rechazada');
		} catch {
			setMsg('Error al rechazar');
		}
	};

	return { list, message: message, accept, reject };
};

