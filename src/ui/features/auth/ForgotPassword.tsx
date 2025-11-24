// src/ui/features/auth/ForgotPassword.tsx
import React, { useState } from 'react';
import axios from 'axios';
import getEnvVariables from '../../../config/configEnvs';

import { Container, Title, Form, Label, Input, Button, Message,
} from './forgotPasswordStyles';

import { validateEmail, validateForm,
} from '../../shared/utils/validation/validators';

interface ForgotPasswordValues {
	email: string;
}

type MessageType = 'success' | 'error' | 'info' | '';

const ForgotPassword: React.FC = () => {
	const [values, setValues] = useState<ForgotPasswordValues>({ email: '' });
	const [fieldErrors, setFieldErrors] = useState<Partial<ForgotPasswordValues>>(
		{}
	);

	const [message, setMessage] = useState('');
	const [messageType, setMessageType] = useState<MessageType>('');
	const [loading, setLoading] = useState(false);

	const { HOST, SERVICE } = getEnvVariables();

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;
		setValues({ email: value });
		setFieldErrors({});
		setMessage('');
		setMessageType('');
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setMessage('');
		setMessageType('');
		setLoading(true);

		//  Validación frontend con reglas de seguridad
		const { errors, isValid } = validateForm<ForgotPasswordValues>(values, {
			email: validateEmail,
		});

		if (!isValid) {
			setFieldErrors(errors);
			setLoading(false);
			return;
		}

		try {
			//  Importante: mensaje de éxito siempre genérico (no revelar si existe)
			await axios.post(`${HOST}${SERVICE}/users/forgot-password`, {
				email: values.email,
			});
			setMessage(
				'Si el email está registrado, se enviará un correo para restablecer la contraseña.'
			);
			setMessageType('success');
		} catch (error) {
			console.error('Error solicitando restablecimiento de contraseña:', error);
			// Mensaje genérico, sin decir si existe o no el usuario
			setMessage(
				'Ocurrió un problema al procesar la solicitud. Inténtalo de nuevo más tarde.'
			);
			setMessageType('error');
		} finally {
			setLoading(false);
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
						value={values.email}
						onChange={handleChange}
						aria-invalid={!!fieldErrors.email}
					/>
					{fieldErrors.email && (
						<Message style={{ color: 'red', marginTop: 4 }}>
							{fieldErrors.email}
						</Message>
					)}
				</div>

				<Button type="submit" disabled={loading}>
					{loading ? 'Enviando…' : 'Enviar'}
				</Button>
			</Form>

			{message && (
				<Message
					style={{
						color:
							messageType === 'success'
								? 'green'
								: messageType === 'error'
								? 'red'
								: '#333',
						marginTop: 8,
					}}
				>
					{message}
				</Message>
			)}
		</Container>
	);
};

export default ForgotPassword;

