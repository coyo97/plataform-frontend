// src/types/profile.ts
import type { Career } from './catalog';

export interface UserProfile {
	_id: string;
	username: string;              // usado como "Nombre"
	apellidoPaterno?: string;      // opcional
	apellidoMaterno?: string;      // opcional
	email: string;
	careers?: Career[];
	bio?: string;
	interests?: string[];
	profilePicture?: string;
	isFriend?: boolean;
	hasSentRequest?: boolean;
	hasReceivedRequest?: boolean;
}

