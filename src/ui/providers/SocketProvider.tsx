// src/ui/features/providers/SocketProvider.tsx
import React, {
	createContext,
	useContext,
	useEffect,
	useState,
} from "react";
import type { Socket } from "socket.io-client";
import { createOrUpdateSocket } from "../../utils/socket/getSocket";

const SocketCtx = createContext<Socket | null>(null);

type Props = {
	children: React.ReactNode;
	token: string | null;
};

export const SocketProvider: React.FC<Props> = ({ children, token }) => {
	const [socket, setSocket] = useState<Socket>(() =>
		createOrUpdateSocket(token),
	);

	useEffect(() => {
		const s = createOrUpdateSocket(token);
		setSocket(s);
	}, [token]);

	return (
		<SocketCtx.Provider value={socket}>{children}</SocketCtx.Provider>
	);
};

export const useSocket = (): Socket => {
	const sock = useContext(SocketCtx);
	if (!sock) {
		throw new Error("useSocket debe usarse dentro de <SocketProvider>");
	}
	return sock;
};

