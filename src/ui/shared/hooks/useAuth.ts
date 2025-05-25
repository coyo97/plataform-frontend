import { getUserId } from '../../../utils/auth/getUserId';

export const useAuth = () => {
	const userId = getUserId();
	const token  = localStorage.getItem('token');
	return { userId, token, isLogged: Boolean(token) };
};

