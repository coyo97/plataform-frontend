// src/ui/components/platform/Publica.tsx
import React from 'react';
import CareerManager from '../careers/CareerManager';
import Chat from '../chat/Chat';
import Header from './Header';
import GroupManager from '../groups/GroupManager';
import Stream from '../stream/Stream';
import JoinStream from '../JoinStream';

const Publica: React.FC = () => {
	const userId = '12345'; // Obtén el userId de la fuente correcta, como estado o props
    const streamId = 'stream123'; // También lo puedes obtener dinámicamente
    return (
        <>
			<Header/>
			 <Stream userId={userId} streamId={streamId} />
			<JoinStream/>
        </>
    );
};

export default Publica;

