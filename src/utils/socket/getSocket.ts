// utils/socket/getSocket.ts
import { io, Socket } from 'socket.io-client';
import getEnv from '../../config/configEnvs';

let socket: Socket | null = null;

export default function getSocket(): Socket {
	if (socket) return socket;
	const { HOST } = getEnv();
	const token    = localStorage.getItem('token');
	socket = io(HOST, { auth: { token } });
	return socket;
}

