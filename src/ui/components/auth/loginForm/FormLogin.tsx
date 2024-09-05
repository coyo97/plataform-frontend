import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate de React Router
import { post } from '../../../../async/api';
import { FormWrapper, FormTitle, FormInput, SubmitButton, FormLabel } from './formLogin.styles';

const FormLogin: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Usa useNavigate para redirección

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const response = await post<{ token: string }>('http://localhost:8000/v1.0/api/users/login', {
                email,
                password
            });
            localStorage.setItem('token', response.token);  // Almacena el token JWT en localStorage
            console.log('Logged in successfully!');

            // Redirigir al usuario después de un inicio de sesión exitoso
            navigate('/plataform');
        } catch (err) {
            setError('Error al iniciar sesión: Verifica tus credenciales.');
            console.error('Login error:', err);
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
            <SubmitButton type="submit">Iniciar sesión</SubmitButton> {/* Botón de submit normal */}
        </FormWrapper>
    );
};

export default FormLogin;

