import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormWrapper, FormTitle, FormInput, SubmitButton, FormLabel } from '../loginForm/formLogin.styles';
import { fetchCareers } from '../../../../async/services/careerService';
import { registerUser } from '../../../../async/services/authService';

interface Career {
	_id: string;
	name: string;
}

const UserForm: React.FC = () => {
	const [username, setUsername] = useState('');
	const [apellidoPaterno, setApellidoPaterno] = useState('');
	const [apellidoMaterno, setApellidoMaterno] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [careers, setCareers] = useState<string[]>([]);
	const [availableCareers, setAvailableCareers] = useState<Career[]>([]);
	const [successMessage, setSuccessMessage] = useState('');
	const [error, setError] = useState('');
	const navigate = useNavigate();

	useEffect(() => {
		const loadCareers = async () => {
			try {
				const data = await fetchCareers();
				setAvailableCareers(data);
			} catch (err) {
				console.error('Error al obtener carreras:', err);
				setError('Error al obtener carreras. Intenta más tarde.');
			}
		};
		loadCareers();
	}, []);

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		try {
			await registerUser({ username,apellidoPaterno, apellidoMaterno, email, password, careers });
			setSuccessMessage('Registro con éxito');
			setTimeout(() => navigate('/login'), 2000);
		} catch (err) {
			console.error('Error al registrar usuario:', err);
			setError('Error al crear usuario. Verifica los datos.');
		}
	};

	return (
		<FormWrapper onSubmit={handleSubmit}>
			<FormTitle>Registro</FormTitle>
			{error && <p style={{ color: 'red' }}>{error}</p>}
			{successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
			<div>
				<FormLabel>Nombre:</FormLabel>
				<FormInput
					type="text"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					required
				/>
			</div>
			<div>
				<FormLabel>Apellido Paterno:</FormLabel>
				<FormInput
					type="text"
					value={apellidoPaterno}
					onChange={(e) => setApellidoPaterno(e.target.value)}
					required
				/>
			</div>

			<div>
				<FormLabel>Apellido Materno:</FormLabel>
				<FormInput
					type="text"
					value={apellidoMaterno}
					onChange={(e) => setApellidoMaterno(e.target.value)}
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
					value={careers[0] || ''}
					onChange={(e) => setCareers([e.target.value])}
					required
					style={{
						padding: '10px',
						borderRadius: '4px',
						border: '1px solid #ddd',
						width: '100%',
					}}
				>
					<option value="" disabled>Seleccione una carrera</option>
					{availableCareers.map(career => (
						<option key={career._id} value={career._id}>
							{career.name}
						</option>
					))}
				</select>
			</div>
			<SubmitButton type="submit">Registro</SubmitButton>
			<SubmitButton type="button" onClick={() => navigate('/login')}>Iniciar Sesión</SubmitButton>
		</FormWrapper>
	);
};

export default UserForm;

