// IncomingMessage.tsx

import React from 'react';
import getEnvVariables from '../../../config/configEnvs';

import {
	IncomingMsgContainer,
	IncomingMsgImg,
	ReceivedMsg,
	TimeDate,
} from './incomingMessage.styles';
import RenderFile from '../../shared/organisms/renderFile/RenderFile';

interface MessageProps {
	message: {
		_id: string;
		content: string;
		createdAt: string;
		filePath?: string;
		fileType?: string;
		sender: {
			_id: string;
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
			return (
				<RenderFile
					filePath={message.filePath}
					fileType={message.fileType}
					baseUrl={HOST}
					title={message.content}
					authorName={message.sender.username}
					elevation={1}
					enableZoom={true}
					maxFeedHeight="min(260px, 40vh)"  
					previewVariant="contain"
				/>
			);
		}

		return <p>{message.content}</p>;
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
