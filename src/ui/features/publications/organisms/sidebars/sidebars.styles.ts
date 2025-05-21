// src/ui/features/publications/organisms/sidebars/sidebars.styles.ts
import { styled, SxProps, Theme } from '@mui/material/styles';
import mq from '../../../../../config/mq';
import { radius } from '../../../../../Theme/tokens/radius';
import { shadows } from '../../../../../Theme/tokens/shadows';
import { colors } from '../../../../../Theme/tokens/colors';
import { padding } from '../../../../../Theme/tokens/padding';

export const SidebarContainer = styled('aside')(({ theme }) => ({
	boxSizing: 'border-box',
	padding: padding.px4, // ← token reutilizable
	background: colors.brand.tertiary[600],
	borderRadius: radius.md, // reemplazamos `theme.shape.borderRadius * 2`
	boxShadow: shadows.sm,   // personalizado desde tokens
	alignSelf: 'flex-start',
	position: 'sticky',
	maxHeight: `calc(100vh - ${theme.mixins.toolbar.minHeight}px - ${theme.spacing(4)})`,
	overflowY: 'auto',
	overflowX: 'hidden',

	[mq('sm', 'max')]: {
		position: 'static',
		width: '100%',
		marginBottom: padding.px4,
	},

	[mq('sm', 'min')]: {
		width: 220,
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
	display: { xs: 'none', sm: 'block' },
	position: 'sticky',
	top: t => `calc(${t.mixins.toolbar.minHeight}px + ${t.spacing(2)})`,
	maxHeight: t => `calc(100vh - ${t.mixins.toolbar.minHeight}px - ${t.spacing(4)})`,
	overflowY: 'auto',
	p: 2.5,
	borderRadius: radius.sm4x,
	bgcolor: colors.uatf.darkBlue,
	boxShadow: shadows.sm,
	overflowX: 'hidden',// bloqueamos la barra
};
