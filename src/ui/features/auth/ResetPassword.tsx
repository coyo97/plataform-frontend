// src/ui/features/auth/ResetPassword.tsx
import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import getEnvVariables from '../../../config/configEnvs';

import { validatePassword, validatePasswordConfirm, validateForm,
} from '../../shared/utils/validation/validators';

interface ResetPasswordValues {
	password: string;
	confirmPassword: string;
}

type MessageType = 'success' | 'error' | 'info' | '';

const ResetPassword: React.FC = () => {
	const { token } = useParams();
	const { HOST, SERVICE } = getEnvVariables();

	const [values, setValues] = useState<ResetPasswordValues>({
		password: '',
		confirmPassword: '',
	});

	const [fieldErrors, setFieldErrors] = useState<
		Partial<ResetPasswordValues>
	>({});
	const [message, setMessage] = useState('');
	const [messageType, setMessageType] = useState<MessageType>('');
	const [loading, setLoading] = useState(false);

	const handleChange =
		<K extends keyof ResetPasswordValues>(field: K) =>
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const { value } = e.target;
			setValues((prev) => ({
				...prev,
				[field]: value,
			}));
			setFieldErrors((prev) => ({
				...prev,
				[field]: undefined,
			}));
			setMessage('');
			setMessageType('');
		};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setMessage('');
		setMessageType('');

		if (!token) {
			setMessage('El enlace de restablecimiento es inválido o está incompleto.');
			setMessageType('error');
			return;
		}

		//  Validamos con las mismas reglas de seguridad que en registro/login
		const { errors, isValid } = validateForm<ResetPasswordValues>(values, {
			password: validatePassword,
			confirmPassword: validatePasswordConfirm(values.password),
		});

		if (!isValid) {
			setFieldErrors(errors);
			return;
		}

		setLoading(true);
		try {
			await axios.post(
				`${HOST}${SERVICE}/users/reset-password/${token}`,
				{ password: values.password }
			);
			setMessage(
				'Contraseña restablecida correctamente. Ahora puedes iniciar sesión.'
			);
			setMessageType('success');
			// Si quieres, aquí podrías redirigir después de unos segundos
		} catch (error) {
			console.error('Error restableciendo la contraseña:', error);
			setMessage('El enlace es inválido o ha expirado.');
			setMessageType('error');
		} finally {
			setLoading(false);
		}
	};

	const hasInvalidToken = !token;

	return (
		<div style={{ maxWidth: 400, margin: '0 auto' }}>
			<h2>Restablecer Contraseña</h2>

			{message && (
				<p
					style={{
						color:
							messageType === 'success'
								? 'green'
								: messageType === 'error'
								? 'red'
								: '#333',
					}}
				>
					{message}
				</p>
			)}

			<form onSubmit={handleSubmit}>
				<div style={{ marginBottom: 12 }}>
					<label htmlFor="password">Nueva Contraseña:</label>
					<input
						type="password"
						id="password"
						value={values.password}
						onChange={handleChange('password')}
						aria-invalid={!!fieldErrors.password}
					/>
					{fieldErrors.password && (
						<p style={{ color: 'red', fontSize: 12 }}>
							{fieldErrors.password}
						</p>
					)}
				</div>

				<div style={{ marginBottom: 12 }}>
					<label htmlFor="confirmPassword">Confirmar Nueva Contraseña:</label>
					<input
						type="password"
						id="confirmPassword"
						value={values.confirmPassword}
						onChange={handleChange('confirmPassword')}
						aria-invalid={!!fieldErrors.confirmPassword}
					/>
					{fieldErrors.confirmPassword && (
						<p style={{ color: 'red', fontSize: 12 }}>
							{fieldErrors.confirmPassword}
						</p>
					)}
				</div>

				<button type="submit" disabled={loading || hasInvalidToken}>
					{loading ? 'Restableciendo…' : 'Restablecer Contraseña'}
				</button>
			</form>
		</div>
	);
};

export default ResetPassword;

