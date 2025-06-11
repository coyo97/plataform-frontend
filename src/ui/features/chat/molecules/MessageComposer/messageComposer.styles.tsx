import { styled } from '@mui/system';
import { padding } from '../../../../../Theme/tokens/padding';

export const Bar = styled('div')({
	display:'flex',
	alignItems:'center',
	gap: padding.px6,
	padding: padding.px6,
});

export const HiddenFile = styled('input')({
	display:'none',
});
