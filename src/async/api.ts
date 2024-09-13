type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";
type Payload = any; // Puedes definir un tipo más específico si sabes la estructura del payload
type Headers = { [key: string]: string };

const getHeaders = (): Headers => {
    const token = localStorage.getItem('token'); // O la forma en que guardas el token
    const headers: Headers = {
        "Content-Type": "application/json",
        ...(token && { "Authorization": `Bearer ${token}` }) // Añade el token si está presente
    };
    return headers;
};

const buildOptions = (payload: Payload, method: HttpMethod, isFile: boolean): RequestInit => {
	const options: RequestInit = {
		method,
		headers: isFile ? undefined : getHeaders(),
	};
	if (method === "POST" || method === "PUT") {
		options.body = isFile ? payload : JSON.stringify(payload);
	}
	return options;
};

const request = async <T>(endpoint: string, payload: Payload, method: HttpMethod, isFile: boolean): Promise<T> => {
	const options = buildOptions(payload, method, isFile);
	console.log("here");
	const response: Response = await fetch(endpoint, options);
	console.log(response);
	if (response.ok) {
		try {
			const data: T = await response.json();
			return data;
		} catch (error) {
			throw error;
		}
	} else {
		throw response.status;
	}
};

export const post = async <T>(endpoint: string, payload: Payload, isFile: boolean = false): Promise<T> =>
	request<T>(endpoint, payload, "POST", isFile);

export const get = async <T>(endpoint: string, payload: Payload, isFile: boolean = false): Promise<T> =>
	request<T>(endpoint, payload, "GET", isFile);


export const put = async <T>(endpoint: string, payload: Payload, isFile: boolean = false): Promise<T> =>
    request<T>(endpoint, payload, "PUT", isFile);

export const del = async <T>(endpoint: string): Promise<T> =>
    request<T>(endpoint, {}, "DELETE", false);
