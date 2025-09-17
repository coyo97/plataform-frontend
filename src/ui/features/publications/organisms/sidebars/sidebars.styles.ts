// src/ui/features/publications/organisms/sidebars/sidebars.styles.ts
import { styled, SxProps, Theme } from '@mui/material/styles';
import mq from '../../../../../config/mq';
import { radius } from '../../../../../Theme/tokens/radius';
import { shadows } from '../../../../../Theme/tokens/shadows';
import { colors } from '../../../../../Theme/tokens/colors';
import { padding } from '../../../../../Theme/tokens/padding';

export const SidebarContainer = styled('aside')(({ theme }) => ({
	boxSizing: 'border-box',
	padding: padding.px4,
	background: colors.brand.tertiary[600],
	borderRadius: radius.md,
	boxShadow: shadows.sm,
	height: '100%',               // ✅ stretch to fill grid row
	position: 'sticky',
	top: theme.mixins.toolbar.minHeight,
	overflowY: 'auto',
	overflowX: 'hidden',

	[mq('sm', 'max')]: {
		position: 'static',
		width: '100%',
		marginBottom: padding.px4,
		height: 'auto',             // ✅ only collapse naturally on mobile
	},

	[mq('sm', 'min')]: {
		width: 200,
	},
}));


export const FilterTitle = styled('h3')(() => ({
	fontSize: '1.125rem', // ≈ 18px
	marginBottom: padding.px4,
	color: colors.uatf.darkBlue,
}));

export const FilterButton = styled('button')<{ active: boolean }>(({ active }) => ({
	display: 'block',
	width: '100%',
	padding: padding.px4,
	marginBottom: padding.px4,
	fontSize: 16,
	textAlign: 'left',
	borderRadius: radius.sm,
	cursor: 'pointer',
	background: active ? colors.uatf.red : colors.neutral.graySoft[50],
	color: active ? '#fff' : colors.uatf.darkBlue,
	border: `1px solid ${colors.uatf.darkBlue}`,
	transition: 'background .2s ease',

	'&:hover': {
		background: active ? colors.uatf.lightRed : colors.neutral.graySoft[100],
	},
}));

export const sidebarSX: SxProps<Theme> = {
	display: { xs: 'none', sm: 'flex' },
	height: '100%',   // ✅ stretch with grid
	justifyContent: 'center', // ✅ center horizontally
	position: 'sticky',
	top: t => t.mixins.toolbar.minHeight,
	maxHeight: t => `calc(100vh - ${t.mixins.toolbar.minHeight}px)`,
	overflowY: 'auto',
	p: 2.5,
	borderRadius: radius.sm4x,
	bgcolor: t => t.palette.common.white,
	background: t => t.customColors.gradients.lavenderBloom,
	boxShadow: shadows.sm,
	overflowX: 'hidden',
};


