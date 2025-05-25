import { isModerationError } from '../../../async/errors/ModerationError';

export const useModerationAlert = () => {
	return (err: unknown) => {
		if (isModerationError(err)) {
			alert(err.message);      // o usa snackbar/toast global
			return true;             // lo manejamos
		}
		return false;              // no era moderación
	};
};

