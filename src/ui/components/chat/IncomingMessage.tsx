// IncomingMessage.tsx
import React from 'react';
import getEnvVariables from '../../../config/configEnvs';

import { IncomingMsgContainer, IncomingMsgImg, ReceivedMsg, TimeDate } from './incomingMessage.styles'; // Importamos los estilos

interface MessageProps {
    message: {
        content: string;
        createdAt: string;
        sender?: { 
            username: string; 
            profilePicture?: string; 
        };
    };
}

export const IncomingMessage: React.FC<MessageProps> = ({ message }) => {
    const { HOST } = getEnvVariables();

    // Verificar los datos del mensaje
    //console.log('Datos del mensaje:', message);

    // Construir la URL completa de la imagen de perfil
const profilePictureUrl = message.sender?.profilePicture 
    ? `${HOST}/${message.sender.profilePicture}` 
    : 'https://ptetutorials.com/images/user-profile.png';

    //console.log('URL de la imagen de perfil:', profilePictureUrl);

    // Validar la fecha y formatearla solo si es válida
    const messageDate = new Date(message.createdAt);
    const formattedDate = isNaN(messageDate.getTime()) ? 'Fecha Inválida' : messageDate.toLocaleString();

return (
        <IncomingMsgContainer>
            <IncomingMsgImg>
                <img 
                    src={profilePictureUrl} 
                    alt={message.sender?.username || 'Usuario'}
                />
            </IncomingMsgImg>
            <ReceivedMsg>
                <p>{message.content}</p>
                <TimeDate>{formattedDate}</TimeDate>
            </ReceivedMsg>
        </IncomingMsgContainer>
    );
};

