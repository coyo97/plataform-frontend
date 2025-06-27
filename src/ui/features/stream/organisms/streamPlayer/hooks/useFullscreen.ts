import { useCallback, useEffect, useState } from 'react';

export const useFullscreen = () => {
	const [isFullscreen, setIsFullscreen] = useState(false);

	const toggle = useCallback((el: HTMLElement | null) => {
		if (!el) return;
		if (!document.fullscreenElement) {
			el.requestFullscreen?.().then(() => setIsFullscreen(true));
		} else {
			document.exitFullscreen?.().then(() => setIsFullscreen(false));
		}
	}, []);

	useEffect(() => {
		const handler = () => setIsFullscreen(!!document.fullscreenElement);
		document.addEventListener('fullscreenchange', handler);
		return () => document.removeEventListener('fullscreenchange', handler);
	}, []);

	return { isFullscreen, toggle };
};

