// src/ui/shared/hooks/useHeaderVisibility.ts
import { useEffect } from 'react';

export function useHeaderVisibility(hidden: boolean) {
	useEffect(() => {
		const prev = document.documentElement.getAttribute('data-hide-header');
		if (hidden) {
			document.documentElement.setAttribute('data-hide-header', 'true');
		} else {
			document.documentElement.removeAttribute('data-hide-header');
		}
		return () => {
			// restaura a su estado anterior
			if (prev == null) {
				document.documentElement.removeAttribute('data-hide-header');
			} else {
				document.documentElement.setAttribute('data-hide-header', prev);
			}
		};
	}, [hidden]);
}

