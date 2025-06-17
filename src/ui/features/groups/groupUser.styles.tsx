// ui/features/groups/groupUser.styles.tsx
import { styled } from '@mui/material/styles';
import mq from '../../../config/mq';
import { padding } from '../../../Theme/tokens/padding';
import { radius }  from '../../../Theme/tokens/radius';
import { shadows } from '../../../Theme/tokens/shadows';
import { colors }  from '../../../Theme/tokens/colors';

export const Wrapper = styled('section')(() => ({
	display      : 'flex',
	flexDirection: 'column',
	gap          : padding.px4,
	padding      : padding.px6,
	maxWidth     : 720,
	marginInline : 'auto',
	background   : colors.neutral.graySoft[50],
	borderRadius : radius.md,
	boxShadow    : shadows.sm,

	[mq('sm', 'max')]: {
		padding: padding.px4,
		gap    : padding.px2,
	},
}));

export const Section = styled('div')(() => ({
	display      : 'flex',
	flexDirection: 'column',
	gap          : padding.px2,
}));

export const Row = styled('div')(() => ({
	display : 'flex',
	alignItems: 'center',
	gap     : padding.px2,
	[mq('sm', 'max')]: { flexDirection: 'column', alignItems: 'stretch' },
}));

export const ListBox = styled('ul')(() => ({
	listStyle   : 'none',
	padding     : 0,
	margin      : 0,
	border      : `1px solid ${colors.neutral.graySoft[200]}`,
	borderRadius: radius.sm,
	overflow    : 'hidden',
}));

export const ListItemBox = styled('li')(() => ({
	padding      : `${padding.px2} ${padding.px4}`,
	borderBottom : `1px solid ${colors.neutral.graySoft[200]}`,
	'&:last-child': { borderBottom: 'none' },
}));

