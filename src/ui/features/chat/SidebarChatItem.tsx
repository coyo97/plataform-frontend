// src/ui/components/chat/SidebarChatItem.tsx
import React from 'react';
import getEnvVariables from '../../../config/configEnvs';
import {
	ChatListItem,
	ChatPeople,
	ChatImage,
	ChatInfo,
} from './sidebarChatItem.styles';

interface User {
	_id: string;
	username: string;
	profile?: { profilePicture?: string };
	profilePicture?: string;
}

interface SidebarChatItemProps {
	item: User;
	isActive: boolean;
	onClick: () => void;
	subtitle?: string;
	badge?: number;
}

export const SidebarChatItem: React.FC<SidebarChatItemProps> = ({
	item,
	isActive,
	onClick,
	subtitle,
}) => {
	const { HOST } = getEnvVariables();

	// Acepta formato anidado o plano
	const rel = item.profile?.profilePicture ?? item.profilePicture ?? '';
	const isAbsolute = /^https?:\/\//i.test(rel);

		//  No uses SERVICE para estáticos
		const imgUrl = isAbsolute
			? rel
			: rel
				? (rel.startsWith('/') ? `${HOST}${rel}` : `${HOST}/${rel}`)
				.replace(/([^:]\/)\/+/g, '$1') // normaliza dobles slash
					: 'https://ptetutorials.com/images/user-profile.png';

					const handleImgError = (e: React.SyntheticEvent<HTMLImageElement>) => {
						(e.currentTarget as HTMLImageElement).src =
							'https://ptetutorials.com/images/user-profile.png';
					};

					return (
						<ChatListItem isActive={isActive} onClick={onClick}>
							<ChatPeople>
								<ChatImage src={imgUrl} alt={item.username} onError={handleImgError} />
								<ChatInfo>
									<h5>{item.username}</h5>
									{subtitle ? (
										<div
											style={{
												fontSize: 12,
												opacity: 0.8,
												whiteSpace: 'nowrap',
												overflow: 'hidden',
												textOverflow: 'ellipsis',
											}}
											title={subtitle}
										>
											{subtitle}
										</div>
									) : null}
								</ChatInfo>
							</ChatPeople>
						</ChatListItem>
					);
};

