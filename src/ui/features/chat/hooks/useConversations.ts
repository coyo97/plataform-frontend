import { useEffect, useState } from 'react';
import {
	fetchFriends, fetchGroups,
} from '../../../../async/services/chatService';

export interface Conversation {
	id      : string;
	name    : string;
	isGroup : boolean;
}

export const useConversations = (myId:string) => {
	const [data, set] = useState<Conversation[]>([]);

	useEffect(() => {
		(async () => {
			const [friends, groups] = await Promise.all([
				fetchFriends(), fetchGroups(),
			]);
			const list:Conversation[] = [
				...friends.filter((u:any)=>u._id!==myId).map((u:any)=>({
					id:u._id, name:u.username, isGroup:false,
				})),
				...groups.map((g:any)=>({ id:g._id, name:g.name, isGroup:true })),
			];
			set(list);
		})();
	}, [myId]);

	return { conversations:data };
};

