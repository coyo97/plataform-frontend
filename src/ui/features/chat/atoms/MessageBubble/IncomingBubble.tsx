// ui/features/chat/atoms/MessageBubble/IncomingBubble.tsx
import React from 'react';
import getEnv from '../../../../../config/configEnvs';
import AvatarX from '../../../../shared/atoms/avatar/AvatarX';
import {
	Wrapper,
	Bubble,
	Time,
	Thumb
} from './incomingBubble.styles';
import type { IncomingBubbleProps } from './incomingBubble.types';

const IncomingBubble: React.FC<IncomingBubbleProps> = ({ msg }) => {
	const { HOST } = getEnv();

	/* ─── foto de perfil segura ───────────────────────── */
	const src = msg.sender.profile?.profilePicture
		? `${HOST}/${msg.sender.profile.profilePicture}`
		: 'https://ptetutorials.com/images/user-profile.png';

		/* ─── fecha formateada ────────────────────────────── */
		const date = new Date(msg.createdAt);
		const when = isNaN(date.getTime())
			? 'Fecha inválida'
			: date.toLocaleString();

			/* ─── contenido (texto ▸ img ▸ file) ─────────────── */
			const render = () => {
				if (msg.filePath && msg.fileType) {
					const url = `${HOST}/${msg.filePath}`;
					return msg.fileType.startsWith('image/')
						? <img src={url} alt="imagen" style={{ maxWidth:'100%' }} />
						: <a href={url} target="_blank">Descargar archivo</a>;
				}
				return <p>{msg.content}</p>;
			};

			return (
				<Wrapper>
					<Thumb>
						<AvatarX src={src} alt={msg.sender.username} size="sm" />
					</Thumb>

					<Bubble>
						{render()}
						<Time>{when}</Time>
					</Bubble>
				</Wrapper>
			);
};

export default IncomingBubble;

