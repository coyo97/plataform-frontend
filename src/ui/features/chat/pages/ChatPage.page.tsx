// ui/features/chat/pages/ChatPage.page.tsx
import React, { useState } from 'react';

import PeoplePanel      from '../organisms/PeoplePanel/PeoplePanel';
import MessageHistory   from '../organisms/MessageHistory/MessageHistory';
import FilledButton     from '../../../shared/atoms/buttons/filledButton/FilledButton';
import SmartBox         from '../../../shared/atoms/box/SmartBox';

import { useConversations } from '../hooks/useConversations';
import { useMessages }      from '../hooks/useMessages';

const ChatPage:React.FC<{ userId:string; floating?:boolean }> = ({ userId, floating }) => {
	/* conversaciones */
	const { conversations } = useConversations(userId);
	const [active, setActive] = useState<null|{id:string; isGroup:boolean}>(null);

	/* mensajes del chat activo */
	const msg = useMessages(active?.id ?? '', active?.isGroup ?? false);

	return (
		<SmartBox row style={{height:'100%'}}>
			<PeoplePanel
				users ={conversations.filter(c=>!c.isGroup).map(({id,name})=>({_id:id,username:name}))}
				groups={conversations.filter(c=> c.isGroup).map(({id,name})=>({_id:id,name}))}
				activeId={active?.id ?? ''}
				onSelectUser ={id=>setActive({id,isGroup:false})}
				onSelectGroup={id=>setActive({id,isGroup:true })}
				floating={Boolean(floating)}
			/>

			{active ? (
				<SmartBox column flex={1}>
					<MessageHistory
						list={msg.list}
						currentUser={userId}
						loadMore={msg.loadMore}
						hasMore={msg.more}
						onDelete={msg.remove}
					/>

					{/* —— zona de input —— */}
					<SmartBox row p="px8" gap="px8">
						{/* textarea controlado */}
						{/* …podrías usar tu TextField multiline aquí… */}
						<FilledButton onClick={()=>{/* abrir file etc */}}>
							Adjuntar
						</FilledButton>
						{/*
						<FilledButton colorType="success"
							onClick={()=>msg.send({ senderId:userId,
												  content:input,
												  chatId:active.id,
												  isGroup:active.isGroup })}>
							Enviar
						</FilledButton>
						  */}
					</SmartBox>
				</SmartBox>
			) : (
				<SmartBox flex={1} center>
					Selecciona un chat
				</SmartBox>
			)}
		</SmartBox>
	);
};
export default ChatPage;

