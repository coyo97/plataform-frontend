// ui/features/chat/organisms/MessageHistory/MessageHistory.tsx
import React from 'react';
import IncomingBubble from '../../atoms/MessageBubble/IncomingBubble';
import OutgoingBubble from '../../atoms/MessageBubble/OutgoingBubble';
import InfiniteScroll from 'react-infinite-scroll-component';
import SmartBox from '../../../../shared/atoms/box/SmartBox';
import { Message } from '../../../../../types/types';

interface Props {
	list: Message[];
	currentUser: string;
	loadMore: () => void;
	hasMore : boolean;
	onDelete: (id:string)=>void;
}

const MessageHistory:React.FC<Props>=({
	list,currentUser,loadMore,hasMore,onDelete,
})=>(
	<SmartBox column flex={1} p="px8" style={{overflow:'hidden'}}>
		<div id="scroll"
			style={{flex:1,display:'flex',flexDirection:'column-reverse',
				overflow:'auto'}}>
			<InfiniteScroll
				dataLength={list.length}
				next={loadMore}
				hasMore={hasMore}
				inverse
				loader={<span>Cargando…</span>}
				scrollableTarget="scroll"
			>
				{list.map(m =>
						  m.sender._id===currentUser
							  ? <OutgoingBubble key={m._id} msg={m} onDelete={onDelete}/>
							  : <IncomingBubble key={m._id} msg={m}/>
						 )}
			</InfiniteScroll>
		</div>
	</SmartBox>
);
export default MessageHistory;

