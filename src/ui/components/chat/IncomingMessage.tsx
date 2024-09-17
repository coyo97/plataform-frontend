// IncomingMessage.tsx
import React from 'react';
import getEnvVariables from '../../../config/configEnvs';

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
    console.log('Datos del mensaje:', message);

    // Construir la URL completa de la imagen de perfil
const profilePictureUrl = message.sender?.profilePicture 
    ? `${HOST}/${message.sender.profilePicture}` 
    : 'https://ptetutorials.com/images/user-profile.png';

    console.log('URL de la imagen de perfil:', profilePictureUrl);

    // Validar la fecha y formatearla solo si es válida
    const messageDate = new Date(message.createdAt);
    const formattedDate = isNaN(messageDate.getTime()) ? 'Fecha Inválida' : messageDate.toLocaleString();

    return (
        <div className="incoming_msg">
            <div className="incoming_msg_img">
                <img 
                    src={profilePictureUrl} 
                    alt={message.sender?.username || 'Usuario'} 
                    style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '50%' }}
                />
            </div>
            <div className="received_msg">
                <div className="received_withd_msg">
                    <p>{message.content}</p>
                    <span className="time_date">{formattedDate}</span>
                </div>
            </div>
        </div>
    );
};

