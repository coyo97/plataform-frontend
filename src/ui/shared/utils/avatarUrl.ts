// src/ui/shared/utils/avatarUrl.ts
import getEnvVariables from '../../../config/configEnvs';

export const DEFAULT_AVATAR = 'https://ptetutorials.com/images/user-profile.png';

export function pickProfilePicture(user: any): string | undefined {
	if (!user) return undefined;
	return (
		user.profile?.profilePicture ??
			user.profilePicture ??
			user.avatar ??
			user.photo ??
			undefined
	);
}

export function resolveProfileImg(host: string, rel?: string): string {
	const val = (rel || '').trim();
	if (!val) return DEFAULT_AVATAR;
	if (/^https?:\/\//i.test(val)) return val;
			const cleanHost = host.replace(/\/+$/, '');
		const cleanPath = val.replace(/^\/+/, '');
	return `${cleanHost}/${cleanPath}`.replace(/([^:]\/)\/+/g, '$1');
}

