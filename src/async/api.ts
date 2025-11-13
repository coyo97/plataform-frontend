import ModerationError from './errors/ModerationError';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
type Payload = any; // Puedes definir un tipo más específico si sabes la estructura del payload
type Headers = { [key: string]: string };

const getHeaders = (): Headers => {
	const token = localStorage.getItem('token'); // O la forma en que guardas el token
	const headers: Headers = {
		'Content-Type': 'application/json',
		'ngrok-skip-browser-warning': 'true',
		...(token && { Authorization: `Bearer ${token}` }), // Añade el token si está presente
	};
	return headers;
};

const buildOptions = (payload: Payload, method: HttpMethod, isFile: boolean): RequestInit => {
	const headers = getHeaders(); // ← siempre calculamos Auth
	if (isFile) delete headers['Content-Type']; // quitamos solo el Content-Type

	const options: RequestInit = {
		method,
		headers, // ya incluye Authorization
	};

	if (method === 'POST' || method === 'PUT') {
		options.body = isFile ? payload : JSON.stringify(payload);
	}
	return options;
};

const request = async <T>(
	endpoint: string,
	payload: Payload,
	method: HttpMethod,
	isFile: boolean
): Promise<T> => {
	const options = buildOptions(payload, method, isFile);

	// helper get() para que acepte params
	if (method === 'GET' && payload && Object.keys(payload).length) {
		const qs = new URLSearchParams(payload).toString();
		endpoint += `?${qs}`;
		payload = {}; // no queremos body en GET
	}

	try {
		const response: Response = await fetch(endpoint, options);

		if (response.ok) {
			try {
				const data: T = await response.json();
				return data;
			} catch (error) {
				// Si el body no es JSON, dejamos que el caller decida qué hacer
				throw error;
			}
		} else {
			/* ----------------------------------------------
			   Intentamos extraer el mensaje que envía el backend
			   (ej. { message: 'Contenido inapropiado detectado …' })
			   ---------------------------------------------- */
			let message = `HTTP ${response.status}`;
			try {
				const errData = await response.json();
				if (typeof (errData as any)?.message === 'string') {
					message = (errData as any).message;
				}
			} catch {
				/* body no era JSON; ignoramos */
			}

			const lower = message.toLowerCase();

			// Detecta los mensajes de moderación que tu backend envía
			if (
				lower.includes('comentario inapropiado') ||
				lower.includes('contenido inapropiado') ||
				lower.includes('moderación') ||
				lower.includes('moderacion')
			) {
				throw new ModerationError(message);
			}

			// Error "normal" con status adjunto para poder mapear en la UI
			const apiError: any = new Error(message);
			apiError.status = response.status;
			throw apiError;
		}
	} catch (err: any) {
		// Si ya es un ModerationError, lo dejamos pasar tal cual
		if (err instanceof ModerationError) {
			throw err;
		}

		// Normalizamos para no filtrar info sensible (URLs, etc.)
		const status = typeof err?.status === 'number' ? err.status : undefined;
		const safeMessage = err?.message || 'Error de red';

		const apiError: any = new Error(safeMessage);
		if (status !== undefined) apiError.status = status;

		// Log mínimo y sanitizado
		console.warn('[API] error', { status: apiError.status, message: apiError.message });

		throw apiError;
	}
};

export const post = async <T>(endpoint: string, payload: Payload, isFile: boolean = false): Promise<T> =>
	request<T>(endpoint, payload, 'POST', isFile);

export const get = async <T>(endpoint: string, payload?: Payload, isFile: boolean = false): Promise<T> =>
	request<T>(endpoint, payload, 'GET', isFile);

export const put = async <T>(endpoint: string, payload: Payload, isFile: boolean = false): Promise<T> =>
	request<T>(endpoint, payload, 'PUT', isFile);

export const del = async <T>(endpoint: string): Promise<T> =>
	request<T>(endpoint, {}, 'DELETE', false);

