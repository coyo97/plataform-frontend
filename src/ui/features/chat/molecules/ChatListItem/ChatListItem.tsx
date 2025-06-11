import React from 'react';
import Text        from '../../../../shared/atoms/typography/Text';
import ChatAvatar  from '../../atoms/ChatAvatar/ChatAvatar';
import { ItemWrap } from './chatListItem.styles';

interface Props {
	id       : string;
	name     : string;
	avatar?  : string;
	active   : boolean;
	onClick  : () => void;
}

const ChatListItem: React.FC<Props> = ({ name, avatar, active, onClick }) => (
	<ItemWrap active={active} onClick={onClick}>
		<ChatAvatar src={avatar} username={name}/>
		<Text weight="medium" sx={{ flex:1, ml:1 }}>{name}</Text>
	</ItemWrap>
);

export default ChatListItem;

