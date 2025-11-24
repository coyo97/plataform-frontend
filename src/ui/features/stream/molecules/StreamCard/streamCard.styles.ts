import { styled } from '@mui/material/styles';
import { colors } from '../../../../../Theme/tokens/colors';
import { radius } from '../../../../../Theme/tokens/radius';
import { padding } from '../../../../../Theme/tokens/padding';
import typography from '../../../../../Theme/tokens/typography';
import { shadows } from '../../../../../Theme/tokens/shadows';
import mq from '../../../../../config/mq';

export const CardContainer = styled('div')<{ dense?: boolean }>(({ dense }) => ({
	display: 'flex',
	flexDirection: dense ? 'row' : 'column',
	background: colors.neutral.white[900],
	borderRadius: radius.sm4x,
	boxShadow: shadows.sm,
	overflow: 'hidden',
	cursor: 'pointer',
	border: `1px solid ${colors.neutral.graySoft[100]}`,
	transition: 'box-shadow 0.2s ease, transform 0.2s ease, border-color 0.2s ease',

	'&:hover, &:focus-visible': {
		boxShadow: shadows.md,
		transform: 'translateY(-2px)',
		borderColor: colors.neutral.graySoft[200],
		outline: 'none',
	},

	'&:active': {
		transform: 'translateY(0) scale(0.995)',
	},
}));

export const Thumbnail = styled('div')<{
	dense?: boolean;
	hasThumb?: boolean;
}>(({ dense, hasThumb }) => ({
	width: dense ? 120 : '100%',
	aspectRatio: dense ? '1 / 1' : '16 / 9',
	backgroundSize: 'cover',
	backgroundPosition: 'center',
	position: 'relative',
	flexShrink: 0,
	overflow: 'hidden',

	// Placeholder bonito si no hay thumb real
	...(hasThumb
		? {}
		: {
			backgroundImage:
				'linear-gradient(135deg, rgba(0,0,0,0.06), rgba(0,0,0,0.02))',
		}),

		// degradé superior para que el badge se lea bien
		'&::after': {
			content: '""',
			position: 'absolute',
			inset: 0,
			background: hasThumb
				? 'linear-gradient(180deg, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0) 60%)'
				: 'none',
				pointerEvents: 'none',
		},

		[mq('sm', 'max')]: {
			aspectRatio: '4 / 3',
		},
}));

export const LiveBadge = styled('span')(() => ({
	position: 'absolute',
	top: padding.px8,
	left: padding.px8,
	display: 'inline-flex',
	alignItems: 'center',
	gap: padding.px4,

	backgroundColor: 'rgba(229,57,53,0.92)',
	color: colors.neutral.white[900],

	padding: `${padding.px2} ${padding.px6}`,
	borderRadius: 999,

	// badge pequeño y pro
	fontWeight: 800,
	letterSpacing: 0.5,
	textTransform: 'uppercase',

	boxShadow: shadows.xs,
	backdropFilter: 'blur(6px)',

	'& .live-dot': {
		width: 6,
		height: 6,
		borderRadius: 999,
		background: colors.neutral.white[900],
		display: 'inline-block',
		boxShadow: '0 0 0 2px rgba(255,255,255,0.25)',
	},
}));

export const Content = styled('div')<{ dense?: boolean }>(({ dense }) => ({
	padding: padding.px12,
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
	gap: padding.px4,
	flex: 1,

	[mq('xs', 'max')]: {
		padding: padding.px8,
	},
}));

export const MetaRow = styled('div')({
	display: 'flex',
	alignItems: 'center',
	gap: padding.px6,
	marginTop: padding.px2,
});

export const InfoRow = styled('div')({
	marginTop: padding.px4,
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-between',
	gap: padding.px8,
	color: colors.neutral.black[900],

	[mq('xs', 'max')]: {
		flexDirection: 'column',
		alignItems: 'flex-start',
		gap: padding.px4,
	},
});

