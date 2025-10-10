import { styled } from '@mui/material/styles';
import SmartBox from '../../atoms/box/SmartBox';

export const ActionsWrapper = styled(SmartBox)(({ theme }) => ({
	display: 'flex',
	alignItems: 'center',
	gap: theme.spacing(1),

	// Zona oculta accesible
	'.sr-only': {
		position: 'absolute',
		width: 1,
		height: 1,
		padding: 0,
		margin: -1,
		overflow: 'hidden',
		clip: 'rect(0, 0, 0, 0)',
		whiteSpace: 'nowrap',
		border: 0,
	},

	'button': {
		borderRadius: 999,
		transition: 'transform 120ms ease, box-shadow 120ms ease, color 120ms ease, background-color 120ms ease',
		outline: 'none',

		// color base suave (no altera tu theme)
		color: theme.palette.text.secondary,

		'&:hover': {
			transform: 'scale(1.04)',
			color: theme.palette.text.primary,
			backgroundColor: theme.palette.action.hover,
		},
		'&:active': {
			transform: 'scale(0.97)',
		},
		'&:focus-visible': {
			boxShadow: `0 0 0 3px ${theme.palette.primary.main}33`,
			backgroundColor: theme.palette.action.hover,
		},
		WebkitTapHighlightColor: 'transparent',
	},

	'svg': {
		transition: 'transform 120ms ease, color 120ms ease',
	},

	'.counter-anim': {
		display: 'inline-block',
		minWidth: '1ch',
		textAlign: 'right',
		transformOrigin: 'bottom',
		animation: 'counter-pop 180ms ease',
	},

	'@keyframes counter-pop': {
		'0%': { transform: 'translateY(2px)', opacity: 0.6 },
		'100%': { transform: 'translateY(0)', opacity: 1 },
	},
}));

