// providers/SocketProvider.tsx  (NUEVO)
import React, { createContext, useContext, useMemo } from 'react';
import { Socket } from 'socket.io-client';
import getSocket from '../../utils/socket/getSocket';

const SocketCtx = createContext<Socket | null>(null);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const socket = useMemo(() => getSocket(), []);   // se crea UNA sola vez
	return <SocketCtx.Provider value={socket}>{children}</SocketCtx.Provider>;
};

export const useSocket = () => {
	const sock = useContext(SocketCtx);
	if (!sock) throw new Error('useSocket debe usarse dentro de <SocketProvider>');
	return sock;
};

