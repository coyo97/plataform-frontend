import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { FormWrapper, FormTitle, FormInput, SubmitButton, FormLabel } from './formLogin.styles';
import { login } from '../../../../async/services/authService';
import { saveSession, LoginResponse } from '../../../../utils/auth/getUserId';

const FormLogin: React.FC = () => {
	const [email, setEmail]       = useState('');
	const [password, setPassword] = useState('');
	const [error, setError]       = useState('');
	const navigate = useNavigate();

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		try {
			const res: LoginResponse = await login({ email, password });

			saveSession({
				token   : res.token,
				userId  : res.userId,
				roles   : res.roles,
				username: res.username,
			});

			console.log('¡Inicio de sesión exitoso!');
			navigate('/plataform');
		} catch (err) {
			console.error('Error de inicio de sesión:', err);
			setError('Error al iniciar sesión: Verifica tus credenciales.');
		}
	};

	return (
		<FormWrapper onSubmit={handleSubmit}>
			<FormTitle>Iniciar sesión</FormTitle>
			{error && <p style={{ color: 'red' }}>{error}</p>}

			<div>
				<FormLabel>Email:</FormLabel>
				<FormInput
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
				/>
			</div>

			<div>
				<FormLabel>Contraseña:</FormLabel>
				<FormInput
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
				/>
			</div>

			<SubmitButton type="submit">Iniciar sesión</SubmitButton>
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

