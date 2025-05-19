// ui/shared/hooks/useSocket.ts
import { useEffect, useMemo } from 'react';
import getSocket from '../../../utils/socket/getSocket';

export const useSocket = () => {
	const sock = useMemo(() => getSocket(), []);
	useEffect(() => {
		return () => { sock.disconnect(); };   // clean-up global o por página
	}, [sock]);
	return sock;
};

