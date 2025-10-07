export const titleCaseES = (s: string) =>
	s.toLowerCase().replace(/\p{L}+/gu, w => w.charAt(0).toUpperCase() + w.slice(1));

