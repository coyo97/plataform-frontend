// src/ui/features/chat/OutgoingMessage.tsx
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
	/** opcional: reintentar envío si falló (optimista) */
	onResend?: (msg: Message) => void;
}

export const OutgoingMessage: React.FC<MessageProps> = ({
	message,
	onDeleteMessage,
	onResend,
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

		// soporta bandera de estado optimista si la agregaste (sending/failed)
		const uiStatus = (message as any).uiStatus as 'sending' | 'failed' | undefined;

		return (
			<OutgoingMsgContainer>
				<SentMsg>
					{renderMessageContent()}

					<div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
						<TimeDate>{formattedDate}</TimeDate>

						{/* Indicadores de estado (opcionales) */}
						{uiStatus === 'sending' && (
							<span style={{ fontSize: 12, opacity: 0.7 }}>Enviando…</span>
						)}
						{uiStatus === 'failed' && (
							<>
								<span style={{ fontSize: 12, color: '#e74c3c' }}>Falló</span>
								{onResend && (
									<button
										style={{ marginLeft: 6 }}
										onClick={() => onResend(message)}  
									>
										Reintentar
									</button>
								)}
							</>
						)}
					</div>

					<button onClick={() => onDeleteMessage(message._id)}>Eliminar</button>
				</SentMsg>
			</OutgoingMsgContainer>
		);
};

