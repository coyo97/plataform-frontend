import { useRef, useCallback } from 'react';

export const useInfiniteScroll = (
	callback: () => void,
	enabled: boolean = true,
) => {
	const observer = useRef<IntersectionObserver | null>(null);

	const lastRef = useCallback((node: HTMLDivElement | null) => {
		if (!enabled) return;
		if (observer.current) observer.current.disconnect();

		observer.current = new IntersectionObserver(entries => {
			if (entries[0].isIntersecting) {
				callback();
			}
		});
		if (node) observer.current.observe(node);
	}, [enabled, callback]);

	return { lastRef };
};

