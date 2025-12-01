// src/ui/features/stream/hooks/useStreamsFeed.ts
import * as api from '../../../../async/services/streamService';
import type { Stream } from '../../../../types/stream';
import { EVENTS } from '../../../../utils/socket/events';
import {
	useRealtimeFeed,
	RegisterFn,
} from '../../../shared/hooks/useRealtimeFeed';

function upsertStream(list: Stream[], incoming: Stream, prepend = true): Stream[] {
	const idx = list.findIndex(x => x._id === incoming._id);
	if (idx === -1) {
		return prepend ? [incoming, ...list] : [...list, incoming];
	}
	const merged: Stream = { ...list[idx], ...incoming };
	const next = list.slice();
	next[idx] = merged;
	return next;
}

function markEnded(list: Stream[], streamId: string): Stream[] {
	const idx = list.findIndex(x => x._id === streamId);
	if (idx === -1) return list;
	const prev = list[idx];
	const merged: Stream = {
		...prev,
		active: false,
		endedAt: prev.endedAt ?? new Date().toISOString(),
	};
	const next = list.slice();
	next[idx] = merged;
	return next;
}

function removeById(list: Stream[], streamId: string): Stream[] {
	return list.filter(x => x._id !== streamId);
}

function toggleLike(list: Stream[], streamId: string, userId: string, like: boolean): Stream[] {
	return list.map(x => {
		if (x._id !== streamId) return x;
		const has = x.likes.includes(userId);
		if (like && !has)   return { ...x, likes: [...x.likes, userId] };
		if (!like && has)   return { ...x, likes: x.likes.filter(id => id !== userId) };
		return x;
	});
}

function applyViewerCount(list: Stream[], streamId: string, payload: any): Stream[] {
	const count =
		typeof payload?.viewerCount === 'number'
			? payload.viewerCount
			: Array.isArray(payload?.viewers)
				? payload.viewers.length
				: undefined;
				if (typeof count !== 'number') return list;
				return list.map(x => (x._id === streamId ? { ...x, viewerCount: count } : x));
}

type FeedType = 'live' | 'ended' | 'all';


export const useStreamsFeed = (type: FeedType = 'live') => {
	const query =
		type === 'live'  ? '?live=true'  :
		type === 'ended' ? '?ended=true' :
		'';

	const register: RegisterFn<Stream> = (socket, set) => {
		const onReconnect = async () => {
			try {
				const fresh = await api.list(query);
				set(() => fresh);
			} catch {
				// silencio: si falla la reconciliación, mantenemos el cache actual
			}
		};

		const onCreated = (payload: any) => {
			// aceptamos {stream} o el stream plano
			const s: Stream = payload?.stream ?? payload;
			if (!s || !s._id) return;
			set(prev => upsertStream(prev, s, /*prepend*/ true));
		};


		const onEnded = (payload: any) => {
			const stream: Stream | undefined = payload?.stream;
			const streamId: string | undefined = payload?.streamId ?? stream?._id;
			if (!streamId) return;

			set(prev => {
				if (type === 'live') {
					// UX: remover del listado en vivo
					return removeById(prev, streamId);
				}
				if (type === 'ended') {
					if (stream && stream._id) {
						const normalized: Stream = { ...stream, active: false, endedAt: stream.endedAt ?? new Date().toISOString() };
						return upsertStream(prev, normalized, true);
					}
					return prev;
				}
				// type === 'all'
				if (stream && stream._id) {
					const normalized: Stream = { ...stream, active: false, endedAt: stream.endedAt ?? new Date().toISOString() };
					return upsertStream(prev, normalized, /*prepend*/ false);
				}
				return markEnded(prev, streamId);
			});
		};

		const onLike = (payload: any) => {
			const { streamId, userId, like } = payload || {};
			if (!streamId || !userId || typeof like !== 'boolean') return;
			set(prev => toggleLike(prev, streamId, userId, like));
		};

		const onUpdateViewers = (payload: any) => {
			const streamId = payload?.streamId;
			if (!streamId) return;
			set(prev => applyViewerCount(prev, streamId, payload));
		};


		const onUpdated = (payload: any) => {
			const stream: Stream | undefined = payload?.stream;
			const streamId: string | undefined = payload?.streamId ?? stream?._id;
			const patch: Partial<Stream> | undefined = payload?.patch ?? stream;
			if (!streamId || !patch) return;
			const normalized = { ...patch } as Stream;
		};

		socket.on('connect', onReconnect);
		socket.on(EVENTS.STREAM_CREATED, onCreated);
		socket.on(EVENTS.STREAM_ENDED,   onEnded);
		socket.on(EVENTS.STREAM_LIKE,    onLike);
		socket.on(EVENTS.UPDATE_VIEWERS, onUpdateViewers);

		return () => {
			socket.off('connect', onReconnect);
			socket.off(EVENTS.STREAM_CREATED, onCreated);
			socket.off(EVENTS.STREAM_ENDED,   onEnded);
			socket.off(EVENTS.STREAM_LIKE,    onLike);
			socket.off(EVENTS.UPDATE_VIEWERS, onUpdateViewers);
		};
	};

	const [streams] = useRealtimeFeed(() => api.list(query), register);

	return {
		streams,
		like:   api.like,
		unlike: api.unlike,
		create: api.create,
		stop:   api.stop,
		join:   api.join,
	};
};

