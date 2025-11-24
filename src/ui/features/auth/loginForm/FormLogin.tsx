// src/ui/features/auth/loginForm/FormLogin.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
	FormWrapper,
	FormTitle,
	FormInput,
	SubmitButton,
	FormLabel,
} from './formLogin.styles';

import { login } from '../../../../async/services/authService';
import { saveSession, LoginResponse } from '../../../../utils/auth/getUserId';

// Validadores centralizados
import {
	validateEmail,
	validatePassword,
	validateForm,
} from '../../../shared/utils/validation/validators';

// Puedes reemplazar MUI Alert por tu componente Alert propio si deseas
import { Alert } from '@mui/material';

interface LoginFormValues {
	email: string;
	password: string;
}

const FormLogin: React.FC = () => {
	const [values, setValues] = useState<LoginFormValues>({
		email: '',
		password: '',
	});

	// Errores de campos (frontend: formato, longitud, etc.)
	const [fieldErrors, setFieldErrors] = useState<Partial<LoginFormValues>>({});

	// Error general (backend: credenciales, permisos, servidor, red, etc.)
	const [error, setError] = useState<string>('');
	const [loading, setLoading] = useState(false);

	const navigate = useNavigate();

	// ------ Mapea errores de login (backend) ------
	const mapLoginError = (err: any): string => {
		const status = err?.status; // viene de api.ts como err.status
		const msg = (err?.message || '').toLowerCase();

		// Usuario eliminado / no existe
		if (status === 404 || msg.includes('usuario no encontrado')) {
			return 'El usuario no existe o fue eliminado.';
		}

		// Credenciales inválidas
		if (status === 401) {
			return 'Credenciales incorrectas o sin permisos activos.';
		}

		// Sin permisos
		if (status === 403) {
			return 'Tu cuenta no tiene permisos activos. Contacta al administrador.';
		}

		// Error del servidor
		if (status >= 500) {
			return 'El servicio no está disponible en este momento.';
		}

		// Error de red u otros
		if (!status) {
			return 'No se pudo conectar con el servidor. Revisa tu conexión.';
		}

		return 'Error al iniciar sesión. Verifica tus credenciales.';
	};

	// Maneja cambios en campos y limpia el error de ese campo
	const handleChange =
		(field: keyof LoginFormValues) =>
		(event: React.ChangeEvent<HTMLInputElement>) => {
			const value = event.target.value;

			setValues((prev) => ({
				...prev,
				[field]: value,
			}));

			// Limpiamos error solo de este campo
			setFieldErrors((prev) => ({
				...prev,
				[field]: undefined,
			}));

			//  también podríamos limpiar el error general al escribir
			setError('');
		};

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		setLoading(true);
		setError('');

		const { errors, isValid } = validateForm<LoginFormValues>(values, {
			email: validateEmail,
			password: validatePassword,
		});

		if (!isValid) {
			setFieldErrors(errors);
			setLoading(false);
			return;
		}

		try {
			const res: LoginResponse = await login({
				email: values.email,
				password: values.password,
			});

			saveSession({
				token: res.token,
				userId: res.userId,
				roles: res.roles,
				username: res.username,
				accountType: res.accountType,
			});

			navigate('/plataform');
		} catch (err: any) {
			console.warn('Login fallido');
			setError(mapLoginError(err));
		} finally {
			setLoading(false);
		}
	};

	return (
		<FormWrapper onSubmit={handleSubmit}>
			<FormTitle>Iniciar sesión</FormTitle>

			{error && (
				<Alert
					severity="warning"
					onClose={() => setError('')}
					sx={{ width: '100%', mb: 1 }}
				>
					{error}
				</Alert>
			)}

			<div>
				<FormLabel htmlFor="email">Email:</FormLabel>
				<FormInput
					id="email"
					type="email"
					value={values.email}
					onChange={handleChange('email')}
					aria-invalid={!!fieldErrors.email}
				/>
				{fieldErrors.email && (
					<p style={{ color: 'red', fontSize: '0.8rem', marginTop: 4 }}>
						{fieldErrors.email}
					</p>
				)}
			</div>

			<div>
				<FormLabel htmlFor="password">Contraseña:</FormLabel>
				<FormInput
					id="password"
					type="password"
					value={values.password}
					onChange={handleChange('password')}
					aria-invalid={!!fieldErrors.password}
				/>
				{fieldErrors.password && (
					<p style={{ color: 'red', fontSize: '0.8rem', marginTop: 4 }}>
						{fieldErrors.password}
					</p>
				)}
			</div>

			<SubmitButton type="submit" disabled={loading}>
				{loading ? 'Ingresando…' : 'Iniciar sesión'}
			</SubmitButton>

			<SubmitButton
				type="button"
				onClick={() => navigate('/forgot-password')}
			>
				Olvidaste tu contraseña
			</SubmitButton>
		</FormWrapper>
	);
};

export default FormLogin;

