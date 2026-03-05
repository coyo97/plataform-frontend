// src/ui/features/stream/organisms/streamPlayer/hooks/useFullscreen.ts
import { useCallback, useEffect, useState } from 'react';

function getActiveScreenVideo(): HTMLVideoElement | null {
	const el = document.getElementById('screenVideo') as HTMLVideoElement | null;
	if (!el) return null;

	const src = el.srcObject;
	const hasVideo =
		src instanceof MediaStream && src.getVideoTracks().length > 0;

	if (!hasVideo) return null;

	// Aunque esté en display:none no debería ocurrir si hay pantalla,
	// pero por si acaso dejamos que sea el target igual.
	return el;
}

export const useFullscreen = () => {
	const [isFullscreen, setIsFullscreen] = useState(false);

	const toggle = useCallback((preferredEl: HTMLElement | null) => {
		// Si YA estamos en fullscreen → salir
		if (document.fullscreenElement) {
			document.exitFullscreen?.()
			.then(() => setIsFullscreen(false))
			.catch((err) => {
				console.warn('[FS] exitFullscreen falló', err);
			});
			return;
		}

		// 1) Intentar SIEMPRE usar la pantalla compartida si existe
		const screenEl = getActiveScreenVideo();

		// 2) Si no hay screen activa, usar el elemento preferido (cam)
		const target = screenEl ?? preferredEl;
		if (!target || !target.requestFullscreen) return;

		target
		.requestFullscreen()
		.then(() => setIsFullscreen(true))
		.catch((err) => {
			console.warn('[FS] requestFullscreen falló', err);
		});
	}, []);

	useEffect(() => {
		const handler = () => setIsFullscreen(!!document.fullscreenElement);
		document.addEventListener('fullscreenchange', handler);
		return () => document.removeEventListener('fullscreenchange', handler);
	}, []);

	return { isFullscreen, toggle };
};

