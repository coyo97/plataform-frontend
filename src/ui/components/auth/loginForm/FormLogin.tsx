import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate de React Router
import { post } from '../../../../async/api';
import { FormWrapper, FormTitle, FormInput, SubmitButton, FormLabel } from './formLogin.styles';
import getEnvVariables from '../../../../config/configEnvs';

// Define una interfaz para la respuesta del inicio de sesión
interface LoginResponse {
    token: string;
    userId: string;
}

const FormLogin: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Usa useNavigate para redirección

	const {HOST, SERVICE} = getEnvVariables();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            // Actualiza el tipo genérico para reflejar la estructura correcta de la respuesta
            //const response = await post<LoginResponse>('localhost:8000/v1.0/api/users/login', {
            const response = await post<LoginResponse>(`${HOST}${SERVICE}/users/login`, {
                email,
                password
            });
            // Almacena el token y el userId en localStorage
            localStorage.setItem('token', response.token);
            localStorage.setItem('userId', response.userId);
            console.log('¡Inicio de sesión exitoso!');

            // Redirigir al usuario después de un inicio de sesión exitoso
            navigate('/plataform');
        } catch (err) {
            setError('Error al iniciar sesión: Verifica tus credenciales.');
            console.error('Error de inicio de sesión:', err);
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
        </FormWrapper>
    );
};

export default FormLogin;

