// src/Theme/tokens/shadows.ts
export const shadows = {
	xs:  '0px 1px 2px rgba(0, 0, 0, 0.05)',
	sm:  '0px 2px 4px rgba(0, 0, 0, 0.06)',
	md:  '0px 4px 8px rgba(0, 0, 0, 0.08)',
	lg:  '0px 6px 12px rgba(0, 0, 0, 0.10)',
	xl:  '0px 10px 20px rgba(0, 0, 0, 0.12)',
	x3l: '0px 16px 32px rgba(0, 0, 0, 0.14)',
};

export type ShadowKey = keyof typeof shadows;

