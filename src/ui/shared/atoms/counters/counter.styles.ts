// shared/atoms/counters/counter.styles.ts
import { styled } from '@mui/material/styles';
import mq from '../../../../config/mq';
import { iconSizes } from '../../../../Theme/tokens/icons';

export const CounterText = styled('span')(({ theme }) => ({
	fontWeight: 600,
	fontSize   : theme.typography.pxToRem(14),
	color     : theme.palette.text.secondary,
	[mq('xs','max')]: { fontSize: 13 },
}));

