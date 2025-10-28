/* payloads de signaling */

export interface OfferPayload  {
	streamId: string;
	offer   : RTCSessionDescriptionInit;
	from?   : string;
	to?     : string;
}

export interface AnswerPayload {
	streamId: string;
	answer  : RTCSessionDescriptionInit;
	from?   : string;
	to?     : string;
}

export interface IcePayload {
	streamId : string;
	candidate: RTCIceCandidateInit;
	from?    : string;
	to?      : string;
}


//////////////
export interface Viewer {
  _id: string;
  username: string;
  socketId: string;//
}

export interface UseStreamConnectionProps {
  streamId: string;
  isStreamer: boolean;
  accessCode?: string;
  onStreamEnd?: () => void;
}

