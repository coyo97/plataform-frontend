import type { Socket } from 'socket.io-client';

export type SocketLike = Socket;

export type OfferPayload = { offer: RTCSessionDescriptionInit; from: string };
export type AnswerPayload = { answer: RTCSessionDescriptionInit; from?: string };
export type IcePayload = { from: string; candidate: RTCIceCandidateInit };

export type ScreenOfferPayload = { offer: RTCSessionDescriptionInit; from: string };
export type ScreenAnswerPayload = { answer: RTCSessionDescriptionInit; from?: string };
export type ScreenIcePayload = { from: string; candidate: RTCIceCandidateInit };

export type ViewerJoinedRequest = { viewerSocketId: string; streamId: string };

