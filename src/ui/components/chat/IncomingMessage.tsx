// src/ui/components/chat/IncomingMessage.tsx
import React from 'react';
import getEnvVariables from '../../../config/configEnvs';

import {
  IncomingMsgContainer,
  IncomingMsgImg,
  ReceivedMsg,
  TimeDate,
} from './incomingMessage.styles';

interface MessageProps {
  message: {
    content: string;
    createdAt: string;
    filePath?: string;
    fileType?: string;
    sender?: {
      username: string;
      profile?: {
        profilePicture?: string;
      };
    };
  };
}

export const IncomingMessage: React.FC<MessageProps> = ({ message }) => {
  const { HOST } = getEnvVariables();

  const profilePictureUrl = message.sender?.profile?.profilePicture
    ? `${HOST}/${message.sender.profile.profilePicture}`
    : 'https://ptetutorials.com/images/user-profile.png';

  const messageDate = new Date(message.createdAt);
  const formattedDate = isNaN(messageDate.getTime())
    ? 'Fecha Inválida'
    : messageDate.toLocaleString();

  const renderMessageContent = () => {
    if (message.filePath && message.fileType) {
      const fileUrl = `${HOST}/${message.filePath}`;
	  //console.log('Mensaje en OutgoingMessage:', message);
      if (message.fileType.startsWith('image/')) {
        return <img src={fileUrl} alt="Imagen" style={{ maxWidth: '100%' }} />;
      } else {
        return (
          <a href={fileUrl} target="_blank" rel="noopener noreferrer">
            Descargar archivo
          </a>
        );
      }
    } else {
      return <p>{message.content}</p>;
    }
  };

  return (
    <IncomingMsgContainer>
      <IncomingMsgImg>
        <img
          src={profilePictureUrl}
          alt={message.sender?.username || 'Usuario'}
        />
      </IncomingMsgImg>
      <ReceivedMsg>
        {renderMessageContent()}
        <TimeDate>{formattedDate}</TimeDate>
      </ReceivedMsg>
    </IncomingMsgContainer>
  );
};

