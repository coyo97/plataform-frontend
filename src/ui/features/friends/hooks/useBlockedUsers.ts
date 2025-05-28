import { useEffect, useState } from 'react';
import { fetchBlockedUsers, unblockUser as unblockService } from '../../../../async/services/friendService';

export const useBlockedUsers = () => {
	const [list, setList] = useState<any[]>([]);
	const [msg, setMsg] = useState('');

	useEffect(() => {
		fetchBlockedUsers().then(setList).catch(() => setMsg('Error al cargar usuarios bloqueados'));
	}, []);

	const unblock = async (id: string) => {
		try {
			await unblockService(id);
			setList(prev => prev.filter(u => u._id !== id));
		} catch {
			setMsg('Error al desbloquear');
		}
	};

	return { list, msg, unblock };
};

