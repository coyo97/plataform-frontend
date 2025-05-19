// ui/features/comments/hooks/useCommentsFeed.ts
import { useEffect, useState } from 'react';
import { list, add, update, remove } from '../../../../async/services/commentService';
import { useSocket } from '../../../shared/hooks/useSocket';
import type { Comment } from '../../../../types/comment';

export const useCommentsFeed = (publicationId: string) => {
	const [comments, setComments] = useState<Comment[]>([]);
	const socket = useSocket();

	// 1) cargar inicial
	useEffect(() => {
		list(publicationId).then(setComments).catch(console.error);
	}, [publicationId]);

	// 2) escuchar socket
	useEffect(() => {
		socket.on('comment:new',   (c: Comment) => c.publication===publicationId && setComments(p=>[...p,c]));
		socket.on('comment:update',(c: Comment) => setComments(p=>p.map(x=>x._id===c._id?c:x)));
		socket.on('comment:remove',(id:string)=> setComments(p=>p.filter(x=>x._id!==id)));
		return () => { socket.off('comment:new').off('comment:update').off('comment:remove'); };
	}, [socket, publicationId]);

	/* helpers para UI -------------------------------------- */
	const create = (content:string) => add(publicationId,content);
	const edit   = (id:string,c:string)=> update(id,c);
	const del    = (id:string)=> remove(id);

	return { comments, create, edit, del };
};
