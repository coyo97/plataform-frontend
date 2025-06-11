import { get, post, del } from '../api';
import getEnv from '../../config/configEnvs';

const { HOST, SERVICE } = getEnv();
const url = (p:string) => `${HOST}${SERVICE}${p}`;

export const fetchMessages = (
	chatId:string,
	isGroup:boolean,
	skip=0,
	limit=20,
) =>
	get<{ messages:any[] }>(
		url(isGroup ? `/messages/group/${chatId}`
			: `/messages/user/${chatId}`),
			{ skip, limit },
).then(r => r.messages);                 // ← sólo devolvemos el array

export const sendMessage = (body:{
	senderId  : string;
	content   : string;
	chatId    : string;
	isGroup   : boolean;
}) => post<void>(url('/messages'), body);

export const sendFileMessage = (fd:FormData) =>
	post<void>(url('/messages/send-with-file'), fd, true);

export const deleteMessage = (id:string) =>
	del<void>(url(`/messages/${id}`));

	/* helpers para Sidebar */
	export const fetchFriends = () => get<{friends:any[]}>(url('/users/friends'), {})
	.then(r => r.friends);
	export const fetchGroups  = () => get<{groups :any[]}>(url('/groups'), {})
	.then(r => r.groups);

