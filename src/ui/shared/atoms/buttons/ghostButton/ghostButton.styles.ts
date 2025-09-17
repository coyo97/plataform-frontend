import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import { GhostButtonProps } from './GhostButton.types';

type ButtonPaletteKey = keyof typeof import('../../../../../Theme/Theme').theme.palette.button;

export const StyledGhostButton = styled(Button, {
	shouldForwardProp: (prop) => prop !== 'colorType',
})<{
	colorType?: ButtonPaletteKey;
}>(({ theme, colorType = 'primary' }) => {
	const buttonPalette = theme.palette.button?.[colorType];

	if (!buttonPalette) {
		console.warn(`GhostButton: colorType "${colorType}" is not defined in theme.palette.button.`);
	}

	return {
		backgroundColor: 'transparent',
		color: buttonPalette?.background,
		fontWeight: 500,
		textTransform: 'none',
		border: 'none',
		padding: theme.spacing(1, 2),
		minWidth: 0,

		'&:hover': {
			backgroundColor: buttonPalette?.hover,
			color: buttonPalette?.text,
		},
		'&:focus': {
			outline: `2px solid ${buttonPalette?.background}`,
			outlineOffset: '2px',
		},
	};
});

