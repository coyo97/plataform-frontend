import AvatarX from '../../../../shared/atoms/avatar/AvatarX';

const ChatAvatar = ({ src, username }: { src?: string; username: string }) =>
	<AvatarX src={src} alt={username} size="sm" />;

export default ChatAvatar;

