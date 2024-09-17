import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import getEnvVariables from '../../../../config/configEnvs';

interface Career {
    _id: string;
    name: string;
}

const UserForm: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [careers, setCareers] = useState<string[]>([]); // Estado para las carreras seleccionadas
    const [availableCareers, setAvailableCareers] = useState<Career[]>([]); // Estado para las carreras disponibles
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();

	const {HOST, SERVICE} = getEnvVariables();

    // Cargar las carreras disponibles desde la API al montar el componente
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

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const userData = {
            username,
            email,
            password,
            careers, // Incluye las carreras seleccionadas en el registro de usuario
        };

        try {
            const response = await axios.post(`${HOST}${SERVICE}/users`, userData);
            console.log(response.data);
            navigate('/register'); // Asegúrate de que esta ruta exista
        } catch (error: any) {
            console.error('Error creating user:', error);
            setError('Error creating user. Please check the details and try again.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
            />
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <select
                multiple
                value={careers}
                onChange={(e) => setCareers(Array.from(e.target.selectedOptions, option => option.value))}
                required
            >
                {availableCareers.map(career => (
                    <option key={career._id} value={career._id}>
                        {career.name}
                    </option>
                ))}
            </select>
            <button type="submit">Create User</button>
        </form>
    );
};

export default UserForm;

