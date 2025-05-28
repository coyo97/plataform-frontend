import ModerationError from './errors/ModerationError';

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";
type Payload = any; // Puedes definir un tipo más específico si sabes la estructura del payload
type Headers = { [key: string]: string };

const getHeaders = (): Headers => {
	const token = localStorage.getItem('token'); // O la forma en que guardas el token
	const headers: Headers = {
		"Content-Type": "application/json",
		"ngrok-skip-browser-warning": "true",
		...(token && { "Authorization": `Bearer ${token}` }) // Añade el token si está presente
	};
	return headers;
};

const buildOptions = (payload: Payload, method: HttpMethod, isFile: boolean,): RequestInit => {
	const headers = getHeaders();          // ← siempre calculamos Auth
	if (isFile) delete headers['Content-Type'];   // ⤴︎ quitamos solo el Content-Type

	const options: RequestInit = {
		method,
		headers,                             // ← ya incluye Authorization
	};

	if (method === 'POST' || method === 'PUT') {
		options.body = isFile ? payload : JSON.stringify(payload);
	}
	return options;
};


const request = async <T>(endpoint: string, payload: Payload, method: HttpMethod, isFile: boolean): Promise<T> => {
	const options = buildOptions(payload, method, isFile);
	//console.log("here");
	if (method === 'GET' && payload && Object.keys(payload).length) {//helper get() para que acepte params
		const qs = new URLSearchParams(payload).toString();
		endpoint += `?${qs}`;
		payload = {};               // no queremos body en GET
	}
	const response: Response = await fetch(endpoint, options);
	//console.log(response);
	if (response.ok) {
		try {
			const data: T = await response.json();
			return data;
		} catch (error) {
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
			if (typeof errData?.message === 'string') {
				message = errData.message;
			}
		} catch {/* body no era JSON; ignoramos */}
		// Detecta los mensajes de moderación que tu backend envía
		if (message.toLowerCase().includes('contenido inapropiado')) {
			throw new ModerationError(message);
		}

		throw new Error(message);//propagamos un Error con .message
	}
};

export const post = async <T>(endpoint: string, payload: Payload, isFile: boolean = false): Promise<T> =>
	request<T>(endpoint, payload, "POST", isFile);

export const get = async <T>(endpoint: string, payload?: Payload, isFile: boolean = false): Promise<T> =>
	request<T>(endpoint, payload, "GET", isFile);


export const put = async <T>(endpoint: string, payload: Payload, isFile: boolean = false): Promise<T> =>
	request<T>(endpoint, payload, "PUT", isFile);

export const del = async <T>(endpoint: string): Promise<T> =>
	request<T>(endpoint, {}, "DELETE", false);
