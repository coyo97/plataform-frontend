import { Message } from '../../../types/types';

export type UiMessageStatus = 'sending' | 'sent' | 'failed';

export type UiMessage = Message & {
	clientId?: string;   // id temporal generado en el cliente
	status?: UiMessageStatus;
};

