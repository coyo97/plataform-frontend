import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import { GhostButtonProps } from './GhostButton.types';

// Define las keys válidas manualmente para garantizar seguridad de tipos
type PaletteColorKey = 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';

export const StyledGhostButton = styled(Button, {shouldForwardProp: (prop) => prop !== 'colorType',})<{colorType?: PaletteColorKey;}>(({ theme, colorType = 'primary' }) => {
	const color = theme.palette[colorType];

	return {
		backgroundColor: 'transparent',
		color: color.main,
		fontWeight: 500,
		textTransform: 'none',
		border: 'none',
		padding: theme.spacing(1, 2),
		minWidth: 0,

		'&:hover': {
			backgroundColor: theme.palette.action.hover,
			textDecoration: 'underline',
		},
		'&:focus': {
			outline: `2px solid ${color.main}`,
			outlineOffset: '2px',
		},
	};
});

