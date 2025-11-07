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
	isOnline?: boolean; // presencia
}

export const SidebarChatItem: React.FC<SidebarChatItemProps> = ({
	item,
	isActive,
	onClick,
	subtitle,
	isOnline = false,
}) => {
	const { HOST } = getEnvVariables();

	const rel = item.profile?.profilePicture ?? item.profilePicture ?? '';
	const isAbsolute = /^https?:\/\//i.test(rel);

		const imgUrl = isAbsolute
			? rel
			: rel
				? (rel.startsWith('/') ? `${HOST}${rel}` : `${HOST}/${rel}`).replace(/([^:]\/)\/+/g, '$1')
				: 'https://ptetutorials.com/images/user-profile.png';

				const handleImgError = (e: React.SyntheticEvent<HTMLImageElement>) => {
					(e.currentTarget as HTMLImageElement).src = 'https://ptetutorials.com/images/user-profile.png';
				};

				return (
					<ChatListItem isActive={isActive} onClick={onClick}>
						{/* nos aseguramos de fila y centrado vertical */}
						<ChatPeople style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
							{/* Wrapper sin forzar ancho/alto para no empujar el texto */}
							<div style={{ position: 'relative', flex: '0 0 auto' }}>
								{/* Por si tu styled ya lo hace, esto es inofensivo */}
								<ChatImage
									src={imgUrl}
									alt={item.username}
									onError={handleImgError}
									style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', display: 'block' }}
								/>
								{/* Dot de presencia superpuesto */}
								<span
									style={{
										position: 'absolute',
										right: -1,
										bottom: -1,
										width: 12,
										height: 12,
										borderRadius: '50%',
										border: '2px solid #fff',
										backgroundColor: isOnline ? '#2ecc71' : '#c2c2c2',
										boxShadow: '0 0 0 1px rgba(0,0,0,0.05)',
										transform: 'translate(0, 0)',
									}}
									aria-label={isOnline ? 'En línea' : 'Desconectado'}
									title={isOnline ? 'En línea' : 'Desconectado'}
								/>
							</div>

							{/* Info ocupa el resto: */}
							<ChatInfo style={{ minWidth: 0, flex: '1 1 auto' }}>
								<h5 style={{ margin: 0, lineHeight: 1.2 }}>{item.username}</h5>
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

