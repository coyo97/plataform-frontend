// src/async/services/profileService.ts

import getEnvVariables from "../../config/configEnvs";

const {HOST, SERVICE} = getEnvVariables();

export const getUserProfile = async (): Promise<any> => {
    const response = await fetch(`${HOST}${SERVICE}/profile`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error(`Error fetching profile: ${response.statusText}`);
    }

    return await response.json();
};

export const updateUserProfile = async (formData: FormData): Promise<void> => {
    const response = await fetch(`${HOST}${SERVICE}/profile`, {
        method: 'PUT',
        body: formData,
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Error updating profile: ${response.statusText}`);
    }
};

