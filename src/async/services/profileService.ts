// src/async/services/profileService.ts
export const getUserProfile = async (): Promise<any> => {
    const response = await fetch('http://localhost:8000/v1.0/api/profile', {
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
    const response = await fetch('http://localhost:8000/v1.0/api/profile', {
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

