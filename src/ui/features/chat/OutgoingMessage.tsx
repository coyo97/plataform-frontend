// src/ui/features/chat/OutgoingMessage.tsx
import React from 'react';
import getEnvVariables from '../../../config/configEnvs';
import {
	OutgoingMsgContainer,
	SentMsg,
	TimeDate,
} from './outgoingMessage.styles';
import { Message } from '../../../types/types';
import RenderFile from '../../shared/organisms/renderFile/RenderFile';

interface MessageProps {
	message: Message;
	onDeleteMessage: (messageId: string) => void;
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
			return (
				<RenderFile
					filePath={message.filePath}
					fileType={message.fileType}
					baseUrl={HOST}
					title={message.content}
					authorName={(message as any).sender?.username}
					elevation={1}
					enableZoom={true}
					maxFeedHeight="min(260px, 40vh)"
					previewVariant="contain"
				/>
			);
		}

		return <p>{message.content}</p>;
	};

	// Tomamos primero status (lo que pones en el optimista y en el ACK)
	// y si no existe, caemos a uiStatus por compatibilidad.
	const rawStatus =
		((message as any).status as 'sending' | 'failed' | 'sent' | undefined) ??
		((message as any).uiStatus as 'sending' | 'failed' | 'sent' | undefined);

	const uiStatus: 'sending' | 'failed' | undefined =
		rawStatus === 'sending'
			? 'sending'
			: rawStatus === 'failed'
			? 'failed'
			: undefined;

	return (
		<OutgoingMsgContainer>
			<SentMsg>
				{renderMessageContent()}

				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						gap: 6,
						marginTop: 4,
					}}
				>
					<TimeDate>{formattedDate}</TimeDate>

					{/* Indicadores de estado */}
					{uiStatus === 'sending' && (
						<span style={{ fontSize: 12, opacity: 0.7 }}>Enviando…</span>
					)}

					{uiStatus === 'failed' && (
						<>
							<span style={{ fontSize: 12, color: '#e74c3c' }}>Falló</span>
							{onResend && (
								<button
									style={{ marginLeft: 6, fontSize: 12 }}
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
;
