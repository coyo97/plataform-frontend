// OutgoingMessage.tsx

import React from 'react';
import getEnvVariables from '../../../config/configEnvs';
import {
	OutgoingMsgContainer,
	SentMsg,
	TimeDate,
} from './outgoingMessage.styles';
import { Message } from '../../../types/types';

interface MessageProps {
	message: Message;
	onDeleteMessage: (messageId: string) => void;
}

export const OutgoingMessage: React.FC<MessageProps> = ({
	message,
	onDeleteMessage,
}) => {
	const { HOST } = getEnvVariables();

	const messageDate = new Date(message.createdAt);
	const formattedDate = isNaN(messageDate.getTime())
		? 'Fecha Inválida'
		: messageDate.toLocaleString();

		const renderMessageContent = () => {
			if (message.filePath && message.fileType) {
				const fileUrl = `${HOST}/${message.filePath}`;
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
			<OutgoingMsgContainer>
				<SentMsg>
					{renderMessageContent()}
					<TimeDate>{formattedDate}</TimeDate>
					<button onClick={() => onDeleteMessage(message._id)}>Eliminar</button>
				</SentMsg>
			</OutgoingMsgContainer>
		);
};

