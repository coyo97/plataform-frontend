import { styled } from '@mui/material/styles';
import { radius } from '../../../../Theme/tokens/radius';
import mq from '../../../../config/mq';

// Variantes permitidas
export type HeaderVariant = 'surface' | 'dark' | 'transparent' | 'gradient' | 'default';

const variantStyles = (variant: HeaderVariant, theme: any) => {
	switch (variant) {
		case 'surface':
			return {
			backgroundColor: theme.palette.header.surface.background,
			color: theme.palette.header.surface.text,
			boxShadow: theme.shadows[1],
		};
		case 'dark':
			return {
			backgroundColor: theme.palette.header.dark.background,
			color: theme.palette.header.dark.text,
			boxShadow: theme.shadows[2],
		};
		case 'transparent':
			return {
			backgroundColor: 'transparent',
			color: theme.palette.text.primary,
			boxShadow: 'none',
		};
		case 'gradient':
			return {
			background: theme.customColors.gradients.oceanTurquoise,
			color: theme.palette.common.white,
			boxShadow: theme.shadows[3],
		};
		default:
			return {
			backgroundColor: theme.palette.header.surface.background,
			color: theme.palette.header.surface.text,
		};
	}
};

export const HeaderContainer = styled('header', {
	shouldForwardProp: (prop) => prop !== 'variant',
})<{ variant?: HeaderVariant }>(({ theme, variant = 'default' }) => ({
	display: 'grid',
	alignItems: 'center',
	gridTemplateColumns: 'auto 1fr auto', // IZQ | CENTRO | DER
	columnGap: theme.spacing(2),
	padding: theme.spacing(1, 2),
	borderRadius: radius.sm4x,
	position: 'fixed',
	top: 0,
	left: 0,
	right: 0,
	zIndex: theme.zIndex.appBar,
	transition: 'all 0.3s ease',
	...variantStyles(variant, theme),

	/* 📱 Mobile: compact header */
	[mq('xs', 'max')]: {
		padding: theme.spacing(1),
	},

	/* 📲 Small (600px) → teléfonos grandes */
	[mq('sm', 'max')]: {
		'& nav span': { fontSize: '0.8rem' },
	},

	/* 💻 Medium (>=900px) */
	[mq('md', 'min')]: {
		'& nav span': { display: 'inline', fontSize: '0.9rem' },
	},

	/* 🖥️ Large (>=1200px) */
	[mq('lg', 'min')]: {
		padding: theme.spacing(2, 3),
	},

	/* 🖥️ XL screens (>=1800px) */
	[mq('xl', 'min')]: {
		maxWidth: '1800px',
		margin: '0 auto', // centrar contenido
	},
}));

export const NavSection = styled('nav')(({ theme }) => ({
	display: 'flex',
	alignItems: 'center',
	gap: theme.spacing(2),
	flexWrap: 'wrap',

	'& a': {
		display: 'flex',
		alignItems: 'center',
		textDecoration: 'none',
		fontWeight: 500,
		color: 'inherit',
		padding: '6px 10px',
		borderRadius: theme.radius.sm4x,
		transition: 'background 0.2s ease-in-out',
		'&:hover': {
			backgroundColor: theme.palette.action.hover,
			textDecoration: 'none',
		},
	},

	/* 📱 Ocultar links en móviles y tablets */
	[mq('md', 'max')]: {
		display: 'none',
	},
}));

/* IZQUIERDA: espacio para hamburguesa y/o logo */
export const LeftSlot = styled('div')(({ theme }) => ({
	display: 'flex',
	alignItems: 'center',
	gap: theme.spacing(1.5),
}));

export const ActionsSection = styled('div')(({ theme }) => ({
	justifySelf: 'end',
	display: 'flex',
	alignItems: 'center',
	gap: theme.spacing(1),
}));

export const Logo = styled('img')(({ theme }) => ({
	height: 36,
	cursor: 'pointer',
	/* En móvil puedes ocultar el logo si quieres ganar espacio */
	[mq('md', 'max')]: { display: 'none' },
}));


export const HamburgerButton = styled('div')(({ theme }) => ({
	display: 'none',

	[mq('md', 'max')]: {
		display: 'flex',
		position: 'fixed',
		top: 8,
		left: 8,
		zIndex: theme.zIndex.drawer + 2,
	},
}));

