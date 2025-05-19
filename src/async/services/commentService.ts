// async/services/commentService.ts
import { get, post, put, del } from '../api';
import * as R           from '../routes/commentRoutes';
import type { Comment } from '../../types/comment';
import getEnvVariables  from '../../config/configEnvs';

const { HOST, SERVICE } = getEnvVariables();
const url = (p:string) => `${HOST}${SERVICE}${p}`;

/* --- LIST ------------------------------------------------------------- */
export const list = async (pubId: string) => {
	const res = await get<{ comments: Comment[] }>( url(R.PUB_COMMENTS(pubId)), {} );
	return res.comments;                 // ← devolvemos sólo el array
};

/* --- CRUD ------------------------------------------------------------- */
export const add    = (pubId: string, content: string) =>
	post<Comment>( url(R.PUB_COMMENTS(pubId)), { content } );

export const update = (id: string, content: string) =>
	put<Comment>( url(`${R.COMMENTS}/${id}`), { content } );

export const remove = (id: string) =>
	del<void>( url(`${R.COMMENTS}/${id}`) );

