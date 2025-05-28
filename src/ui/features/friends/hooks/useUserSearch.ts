import { useState } from 'react';
import { searchUsers, sendFriendRequest } from '../../../../async/services/friendService';

export const useUserSearch = () => {
	const [results, setResults] = useState<any[]>([]);
	const [msg, setMsg] = useState('');

	const search = async (q: string) => {
		try { setResults(await searchUsers(q)); }
		catch { setMsg('Error al buscar'); }
	};

	const sendRequest = async (id: string) => {
		try {
			await sendFriendRequest(id);
			setResults(r => r.map(u => u._id === id ? { ...u, status: 'request_sent' } : u));
			setMsg('Solicitud enviada');
		} catch { setMsg('Error al enviar'); }
	};

	return { results, msg, search, sendRequest };
};

