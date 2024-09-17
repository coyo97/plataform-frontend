// src/ui/components/platform/Publica.tsx
import React from 'react';
import CareerManager from '../careers/CareerManager';
import Chat from '../chat/Chat';
import Header from './Header';
import GroupManager from '../groups/GroupManager';

const Publica: React.FC = () => {
    // Supongamos que el userId está almacenado en localStorage
    const userId = localStorage.getItem('userId'); // O usa el contexto de tu app si está disponible

    if (!userId) {
        // Manejar caso en que no haya userId (usuario no autenticado, por ejemplo)
        return <div>Necesitas estar autenticado para usar el chat.</div>;
    }

    return (
        <>
			<Header/>
           {/* Pasa el userId como prop al componente Chat */}
			<Chat userId={userId} />
        </>
    );
};

export default Publica;

