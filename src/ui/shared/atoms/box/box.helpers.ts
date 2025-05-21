import { padding } from '../../../../Theme/tokens/padding';
import { radius } from '../../../../Theme/tokens/radius';
import { shadows } from '../../../../Theme/tokens/shadows';

export const pad = (k?: keyof typeof padding) => k ? padding[k] : undefined;
export const rad = (k?: keyof typeof radius)  => k ? radius[k]  : undefined;
export const sha = (k?: keyof typeof shadows) => k ? shadows[k] : undefined;

