import { styled } from '@mui/material/styles';
import mq from '../../../config/mq';                       // ← helper de breakpoints
import { padding } from '../../../Theme/tokens/padding';
import { radius }  from '../../../Theme/tokens/radius';
import { shadows } from '../../../Theme/tokens/shadows';
import { colors }  from '../../../Theme/tokens/colors';

export const GroupContainer = styled('section')(() => ({
	display      : 'flex',
	flexDirection: 'column',
	gap          : padding.px4,
	padding      : padding.px6,
	borderRadius : radius.md,
	background   : colors.neutral.graySoft[50],
	boxShadow    : shadows.sm,
	marginInline : 'auto',
	width        : '100%',
	maxWidth     : 640,

	[mq('sm', 'max')]: {
		padding : padding.px4,
		gap     : padding.px2,
		maxWidth: '100%',
	},
}));

export const GroupList = styled('ul')(() => ({
	listStyle  : 'none',
	margin     : 0,
	padding    : 0,
	border     : `1px solid ${colors.neutral.graySoft[200]}`,
	borderRadius: radius.sm,
	overflow   : 'hidden',
}));

export const GroupItem = styled('li')(() => ({
	display       : 'flex',
	justifyContent: 'space-between',
	alignItems    : 'center',
	padding       : `${padding.px4} ${padding.px6}`,
	borderBottom  : `1px solid ${colors.neutral.graySoft[200]}`,

	'&:last-child': { borderBottom: 'none' },

	[mq('sm', 'max')]: {
		flexDirection  : 'column',
		alignItems     : 'stretch',
		gap            : padding.px2,
		padding        : `${padding.px2} ${padding.px4}`,
	},
}));

