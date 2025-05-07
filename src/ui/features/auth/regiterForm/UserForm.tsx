import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FormWrapper, FormTitle, FormInput, SubmitButton, FormLabel } from '../loginForm/formLogin.styles';
import getEnvVariables from '../../../../config/configEnvs';

interface Career {
	_id: string;
	name: string;
}

const UserForm: React.FC = () => {
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [careers, setCareers] = useState<string[]>([]);
	const [availableCareers, setAvailableCareers] = useState<Career[]>([]);
	const [successMessage, setSuccessMessage] = useState('');
	const [error, setError] = useState('');
	const navigate = useNavigate();

	const { HOST, SERVICE } = getEnvVariables();

	useEffect(() => {
		const fetchCareers = async () => {
			try {
				const response = await axios.get(`${HOST}${SERVICE}/careers`, {
					headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
				});
				setAvailableCareers(response.data.careers);
			} catch (error) {
				console.error('Error fetching careers:', error);
				setError('Error fetching careers. Please try again later.');
			}
		};
		fetchCareers();
	}, []);

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		const userData = { username, email, password, careers };

		try {
			await axios.post(`${HOST}${SERVICE}/users`, userData);
			setSuccessMessage('Registro con éxito');
			setTimeout(() => {
				navigate('/login'); // Redirigir al usuario a la página de inicio de sesión
			}, 2000); // Esperar 2 segundos antes de redirigir
		} catch (error: any) {
			console.error('Error creating user:', error);
			setError('Error creando usuario. Por favor, verifica los datos e inténtalo de nuevo.');
		}
	};

	return (
		<FormWrapper onSubmit={handleSubmit}>
			<FormTitle>Registro</FormTitle>
			{error && <p style={{ color: 'red' }}>{error}</p>}
			{successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
			<div>
				<FormLabel>Username:</FormLabel>
				<FormInput
					type="text"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					required
				/>
			</div>
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
				<FormLabel>Password:</FormLabel>
				<FormInput
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
				/>
			</div>
			<div>
				<FormLabel>Carreras:</FormLabel>
				<select
					value={careers[0]}
					onChange={(e) => setCareers([e.target.value])}
					required
					style={{
						padding: '10px',
						borderRadius: '4px',
						border: '1px solid #ddd',
						width: '100%',
					}}
				>
					{availableCareers.map(career => (
						<option key={career._id} value={career._id}>
							{career.name}
						</option>
					))}
				</select>
			</div>
			<SubmitButton type="submit">Registro</SubmitButton>
			<SubmitButton onClick={() => navigate('/login')}>Iniciar Sesión</SubmitButton>
		</FormWrapper>
	);
};

export default UserForm;

