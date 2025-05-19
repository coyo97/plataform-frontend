// src/Theme/tokens/radius.ts

export const radius = {
	none: 0,
	xsm: '1px',
	sm: '2px',
	sm2x: '4px',
	sm3x: '6px',
	sm4x: '8px',
	md: '12px',
	md2x: '16px',
	md3x: '18px',
	mdlg: '20px',
	mdlg2x: '24px',
	mdlg3x: '32px',
	infinity: '9999px', // completamente redondo
};

export type RadiusKey = keyof typeof radius;

