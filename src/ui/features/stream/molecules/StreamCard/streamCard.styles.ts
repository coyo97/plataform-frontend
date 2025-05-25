// src/ui/features/stream/molecules/StreamCard/streamCard.styles.ts
import { styled } from '@mui/material/styles';
import { colors } from '../../../../../Theme/tokens/colors';
import { radius } from '../../../../../Theme/tokens/radius';
import { padding } from '../../../../../Theme/tokens/padding';
import typography from '../../../../../Theme/tokens/typography';
import { shadows } from '../../../../../Theme/tokens/shadows';

export const CardContainer = styled('div')<{ dense?: boolean }>(({ dense }) => ({
	display: 'flex',
	flexDirection: dense ? 'row' : 'column',
	background: colors.neutral.graySoft[50],
	borderRadius: radius.sm4x,
	boxShadow: shadows.sm,
	overflow: 'hidden',
	cursor: 'pointer',
	transition: 'box-shadow 0.2s ease',
	'&:hover': {
		boxShadow: shadows.md,
	},
}));

export const Thumbnail = styled('div')<{ dense?: boolean }>(({ dense }) => ({
	width: dense ? 100 : '100%',
	height: dense ? 100 : 130,
	backgroundSize: 'cover',
	backgroundPosition: 'center',
	position: 'relative',
	flexShrink: 0,
}));

export const LiveBadge = styled('span')({
	position: 'absolute',
	top: padding.px8,
	right: padding.px8,
	backgroundColor: colors.feedback.negative[500],
	color: colors.neutral.white[900],
	padding: `${padding.px2} ${padding.px6}`,
	borderRadius: radius.sm2x,
	fontSize: typography.heading.h3.sans.regular.fontSize,
	fontWeight: typography.heading.h3.sans.regular.fontWeight,
});

export const Content = styled('div')<{ dense?: boolean }>(({ dense }) => ({
	padding: padding.px12,
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
	gap: padding.px4,
	flex: 1,
}));

export const InfoRow = styled('div')({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-between',
	fontSize: typography.heading.h3.sans.regular.fontSize,
	color: colors.neutral.black[900],
});

