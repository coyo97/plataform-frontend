// ui/features/comments/hooks/useCommentsFeed.ts
import { useEffect, useState } from 'react';
import { list, add, update, remove } from '../../../../async/services/commentService';
import * as api   from '../../../../async/services/commentService';
import { useSocket } from '../../../shared/hooks/useSocket';
import { EVENTS } from '../../../../utils/socket/events';
import type { Comment } from '../../../../types/comment';
import { useRealtimeFeed, RegisterFn } from '../../../shared/hooks/useRealtimeFeed';

const register: RegisterFn<Comment> = (socket, set) => {
	socket.on(EVENTS.COMMENT_NEW,    c  => set(p=>[...p, c]));
	socket.on(EVENTS.COMMENT_UPDATE, c  => set(p=>p.map(x=>x._id===c._id?c:x)));
	socket.on(EVENTS.COMMENT_REMOVE, id => set(p=>p.filter(x=>x._id!==id)));

	return () => socket
	.off(EVENTS.COMMENT_NEW)
	.off(EVENTS.COMMENT_UPDATE)
	.off(EVENTS.COMMENT_REMOVE);
};

export const useCommentsFeed = (publicationId: string) => {
	const [comments, setComments] = useRealtimeFeed(
		() => api.list(publicationId),
		register
	);

	const create = (content:string)=> api.add(publicationId,content);
	const edit   = (id:string,c:string)=> api.update(id,c);
	const del    = (id:string)=> api.remove(id);

	return { comments, create, edit, del };
};
