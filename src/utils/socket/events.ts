// utils/socket/events.ts
export const EVENTS = {
	/* Comentarios */
	COMMENT_NEW:     'comment:new',
	COMMENT_UPDATE:  'comment:update',
	COMMENT_REMOVE:  'comment:remove',

	/* Streams – feed */
	STREAM_CREATED:  'stream-created',
	STREAM_ENDED:    'stream-ended',
	STREAM_LIKE:     'stream-like',
	VIEWER_COUNT:    'viewer-count',

	/* Streams – conexión WebRTC */
	JOIN_STREAM:        'join-stream',
	OFFER:              'offer',
	ANSWER:             'answer',
	ICE_CANDIDATE:      'ice-candidate',
	UPDATE_VIEWERS:     'update-viewers',
	START_SCREEN_SHARE: 'start-screen-share',
	KICK_VIEWER:        'kick-viewer',
	LEAVE_STREAM: 'leave-stream',
	TOGGLE_CAMERA : 'toggle-camera',
	TOGGLE_MIC    : 'toggle-mic',
} as const;


export const CHAT_EVENTS = {
  MESSAGE_NEW   : 'chat:message:new',
  MESSAGE_DELETE: 'chat:message:deleted',
} as const;

export type ChatEvent = typeof CHAT_EVENTS[keyof typeof CHAT_EVENTS];

