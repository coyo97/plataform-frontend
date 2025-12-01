// src/utils/socket/getSocket.ts
import { io, Socket } from "socket.io-client";
import getEnv from "../../config/configEnvs";

let socket: Socket | null = null;
let currentToken: string | null = null;


export function createOrUpdateSocket(token: string | null): Socket {
	const { HOST } = getEnv();

	// Si ya tenemos un socket con el mismo token, lo reutilizamos.
	if (socket && currentToken === token) {
		return socket;
	}

	// Si hay un socket viejo con otro token, lo desconectamos.
	if (socket) {
		socket.disconnect();
		socket = null;
	}

	socket = io(HOST, {
		transports: ["polling"], // por Cloudflare/ngrok
		extraHeaders: {
			"ngrok-skip-browser-warning": "true",
		},
		auth: { token }, // puede ser null, el back lo validará
	});

	currentToken = token ?? null;
	return socket;
}

