// src/ui/components/context/UserContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import getEnvVariables from '../../../config/configEnvs';

interface Profile {
    _id: string;
    username: string;
    email: string;
    bio?: string;
    interests?: string[];
    profilePicture?: string;
}

interface UserContextProps {
    currentUser: Profile | null;
    setCurrentUser: React.Dispatch<React.SetStateAction<Profile | null>>;
}

const UserContext = createContext<UserContextProps>({
    currentUser: null,
    setCurrentUser: () => {},
});

export const useUser = () => useContext(UserContext);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<Profile | null>(null);
    const { HOST, SERVICE } = getEnvVariables();

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${HOST}${SERVICE}/profile`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setCurrentUser(response.data.profile);
            } catch (error) {
                console.error('Error fetching current user profile:', error);
            }
        };

        fetchCurrentUser();
    }, [HOST, SERVICE]);

    return (
        <UserContext.Provider value={{ currentUser, setCurrentUser }}>
            {children}
        </UserContext.Provider>
    );
};

