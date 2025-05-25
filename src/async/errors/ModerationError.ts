export default class ModerationError extends Error {
	constructor(message = 'Contenido inapropiado detectado') {
		super(message);
		this.name = 'ModerationError';
	}
}

export const isModerationError = (err: unknown): err is ModerationError =>
	err instanceof ModerationError;

