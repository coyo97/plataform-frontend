// OutgoingMessage.tsx

import React from 'react';
import getEnvVariables from '../../../config/configEnvs';

import {
	OutgoingMsgContainer,
	SentMsg,
	TimeDate,
} from './outgoingMessage.styles';

interface MessageProps {
	message: {
		content: string;
		createdAt: string;
		filePath?: string;
		fileType?: string;
	};
}

export const OutgoingMessage: React.FC<MessageProps> = ({ message }) => {
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
				</SentMsg>
			</OutgoingMsgContainer>
		);
};
