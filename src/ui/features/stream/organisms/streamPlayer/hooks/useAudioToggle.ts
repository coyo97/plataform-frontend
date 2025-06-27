import { useState, RefObject } from 'react';

export const useAudioToggle = (videoRef: RefObject<HTMLVideoElement>) => {
	const [enabled, setEnabled] = useState(false);

	const toggle = () => {
		const v = videoRef.current;
		if (!v) return;
		if (enabled) {
			v.muted = true;
			setEnabled(false);
		} else {
			v.muted = false;
			v.volume = 1;
			v.play().catch(console.error);
			setEnabled(true);
		}
	};

	return { enabled, toggle };
};

