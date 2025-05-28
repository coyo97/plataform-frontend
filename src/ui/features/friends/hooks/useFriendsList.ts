import { useEffect, useState } from 'react';
import { fetchFriends, removeFriend, blockUser } from '../../../../async/services/friendService';

export const useFriendsList = () => {
	const [list, setList] = useState<any[]>([]);
	const [msg,  setMsg ] = useState('');

	useEffect(() => { fetchFriends().then(setList).catch(() => setMsg('Error')); }, []);

	const remove = async (id: string) => {
		try { await removeFriend(id); setList(l => l.filter(f => f._id !== id)); }
		catch { setMsg('Error al eliminar'); }
	};

	const block = async (id: string) => {
		try { await blockUser(id); setList(l => l.filter(f => f._id !== id)); }
		catch { setMsg('Error al bloquear'); }
	};

	return { list, msg, remove, block };
};

