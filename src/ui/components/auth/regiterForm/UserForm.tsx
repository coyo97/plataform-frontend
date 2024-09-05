import React, { useState } from 'react';
import axios from 'axios';
import { User } from '../../../../types/User';
import {useNavigate} from 'react-router-dom';

const UserForm: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
	const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const userData: User = {
            username,
            email,
            password
        };

        try {
            // Cambia la URL al puerto 8000
            const response = await axios.post('http://localhost:8000/v1.0/api/users', userData);
            console.log(response.data); // Manejar la respuesta del backend
			navigate('/register');
        } catch (error) {
            console.error('Error creating user:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
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
            <button type="submit">Create User</button>
        </form>
    );
};

export default UserForm;

