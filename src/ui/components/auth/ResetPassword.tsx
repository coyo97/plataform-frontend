import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import getEnvVariables from '../../../config/configEnvs';

const ResetPassword: React.FC = () => {
	const { token } = useParams();
	console.log('Token recibido:', token);

	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [message, setMessage] = useState('');
	const { HOST, SERVICE } = getEnvVariables();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (password !== confirmPassword) {
			setMessage('Las contraseñas no coinciden');
			return;
		}
		try {
			await axios.post(`${HOST}${SERVICE}/users/reset-password/${token}`, { password });
			setMessage('Contraseña restablecida correctamente. Ahora puedes iniciar sesión.');
		} catch (error) {
			console.error('Error restableciendo la contraseña:', error);
			setMessage('El enlace es inválido o ha expirado.');
		}
	};

	return (
		<div>
			<h2>Restablecer Contraseña</h2>
			<form onSubmit={handleSubmit}>
				<div>
					<label htmlFor="password">Nueva Contraseña:</label>
					<input
						type="password"
						id="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
						minLength={6}
					/>
				</div>
				<div>
					<label htmlFor="confirmPassword">Confirmar Nueva Contraseña:</label>
					<input
						type="password"
						id="confirmPassword"
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						required
						minLength={6}
					/>
				</div>
				<button type="submit">Restablecer Contraseña</button>
			</form>
			{message && <p>{message}</p>}
		</div>
	);
};

export default ResetPassword;

