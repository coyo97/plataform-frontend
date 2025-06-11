import { styled } from '@mui/system';
import mq from '../../../../../config/mq';
import { padding } from '../../../../../Theme/tokens/padding';

export const Wrapper = styled('div')({
	flex: 1,
	display: 'flex',
	flexDirection: 'column',
	height: '100%',
	width: '100%',
});

export const ScrollArea = styled('div')({
	flex: 1,
	overflow: 'auto',
	display: 'flex',
	flexDirection: 'column-reverse',
	padding: padding.px8,
	[mq('sm','min')]: { padding: padding.px12 },
});

export const List = styled('div')({
	display: 'flex',
	flexDirection: 'column',
	gap: padding.px8,
});

