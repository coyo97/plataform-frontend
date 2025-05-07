import React, { useState } from 'react';
import axios from 'axios';
import getEnvVariables from '../../../config/configEnvs';
import {
	Container,
	Title,
	Form,
	Label,
	Input,
	Button,
	Message,
} from './forgotPasswordStyles';

const ForgotPassword: React.FC = () => {
	const [email, setEmail] = useState('');
	const [message, setMessage] = useState('');
	const { HOST, SERVICE } = getEnvVariables();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			await axios.post(`${HOST}${SERVICE}/users/forgot-password`, { email });
			setMessage('Si el email está registrado, se enviará un correo para restablecer la contraseña');
		} catch (error) {
			console.error('Error solicitando restablecimiento de contraseña:', error);
			setMessage('Ocurrió un error. Por favor, inténtalo de nuevo más tarde.');
		}
	};

	return (
		<Container>
			<Title>Recuperar Contraseña</Title>
			<Form onSubmit={handleSubmit}>
				<div>
					<Label htmlFor="email">Correo Electrónico:</Label>
					<Input
						type="email"
						id="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
				</div>
				<Button type="submit">Enviar</Button>
			</Form>
			{message && <Message>{message}</Message>}
		</Container>
	);
};

export default ForgotPassword;

