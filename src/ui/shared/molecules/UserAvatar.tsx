// src/ui/shared/molecules/UserAvatar.tsx
import React, { useEffect, useMemo, useState } from 'react';
import getEnvVariables from '../../../config/configEnvs';
import { fetchProfileById } from '../../../async/services/userProfileService';

const DEFAULT_AVATAR = 'https://ptetutorials.com/images/user-profile.png';

// cache simple en memoria para no refetchear por cada render
const AVATAR_CACHE = new Map<string, string>();

type AnyUser = {
	_id: string;
	username?: string;
	profile?: { profilePicture?: string | null };
	profilePicture?: string | null;
	avatar?: string | null;
	photo?: string | null;
};

type Props = {
	user: AnyUser;
	size?: number;           // px
	rounded?: boolean;       // true → círculo
	style?: React.CSSProperties;
	className?: string;
	altFallback?: string;    // alt si no hay username
};

function pickProfilePicture(u?: AnyUser | null) {
	if (!u) return undefined;
	return (
		u.profile?.profilePicture ??
			u.profilePicture ??
			u.avatar ??
			u.photo ??
			undefined
	);
}

function resolveProfileImg(host: string, rel?: string | null): string {
	const val = (rel || '').trim();
	if (!val) return DEFAULT_AVATAR;
	if (/^https?:\/\//i.test(val)) return val;
			const h = host.replace(/\/+$/, '');
		const p = val.replace(/^\/+/, '');
	return `${h}/${p}`.replace(/([^:]\/)\/+/g, '$1');
}

const UserAvatar: React.FC<Props> = ({
	user,
	size = 40,
	rounded = true,
	style,
	className,
	altFallback = 'avatar',
}) => {
	const { HOST } = getEnvVariables();
	const cacheKey = user?._id || '';

	const initialRel = pickProfilePicture(user);
	const initialSrc = useMemo(
		() => resolveProfileImg(HOST, initialRel),
		[HOST, initialRel]
	);

	const [src, setSrc] = useState<string>(() => {
		if (cacheKey && AVATAR_CACHE.has(cacheKey)) return AVATAR_CACHE.get(cacheKey)!;
		return initialSrc;
	});

	useEffect(() => {
		// si ya tenemos en cache, usarlo
		if (cacheKey && AVATAR_CACHE.has(cacheKey)) {
			setSrc(AVATAR_CACHE.get(cacheKey)!);
			return;
		}

		// si ya vino en el item, resuelto
		if (initialRel) {
			if (cacheKey) AVATAR_CACHE.set(cacheKey, initialSrc);
			setSrc(initialSrc);
			return;
		}

		// no vino la foto → la buscamos por id
		let alive = true;
		(async () => {
			try {
				if (!user?._id) return;
				const prof = await fetchProfileById(user._id);
				const rel = pickProfilePicture({ profile: { profilePicture: (prof as any)?.profilePicture } } as AnyUser);
				const finalSrc = resolveProfileImg(HOST, rel);
				if (!alive) return;
				if (cacheKey) AVATAR_CACHE.set(cacheKey, finalSrc);
				setSrc(finalSrc);
			} catch {
				if (!alive) return;
				setSrc(DEFAULT_AVATAR);
			}
		})();
		return () => { alive = false; };
	}, [cacheKey, HOST, initialRel, initialSrc, user?._id]);

	const onError = (e: React.SyntheticEvent<HTMLImageElement>) => {
		(e.currentTarget as HTMLImageElement).src = DEFAULT_AVATAR;
		if (cacheKey) AVATAR_CACHE.set(cacheKey, DEFAULT_AVATAR);
	};

	const alt = user?.username || altFallback;

	return (
		<img
			src={src}
			alt={alt}
			onError={onError}
			className={className}
			style={{
				width: size,
				height: size,
				borderRadius: rounded ? '50%' : 8,
				objectFit: 'cover',
				display: 'block',
				...style,
			}}
		/>
	);
};

export default UserAvatar;

