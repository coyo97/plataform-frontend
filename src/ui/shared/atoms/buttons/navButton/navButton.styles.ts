// shared/atoms/buttons/navButton/navButton.styles.ts
import { styled } from '@mui/material/styles';
import ButtonBase from '@mui/material/ButtonBase';
import { colors } from '../../../../../Theme/tokens/colors';

export const StyledNavButton = styled(ButtonBase)<{ active?: boolean }>(({ theme, active }) => ({
	display: 'flex',
	alignItems: 'center',
	width: '100%',
	justifyContent: 'flex-start',
	padding: theme.spacing(1.5, 2),
	borderRadius: 8,
	textAlign: 'left',
	gap: theme.spacing(2),
	color: theme.palette.colorButton.main,
	backgroundColor: active ? theme.palette.background.paper : 'transparent',
	fontFamily: "'Poppins', sans-serif",
	fontSize: '1rem',
	fontWeight: active ? 600 : 400, // 👈 Cambia el peso según estado
	transition: 'background-color 0.3s ease, font-weight 0.3s ease', // 👈 Transiciones suaves
	cursor: 'pointer',

	'&:hover': {
		backgroundColor: colors.brand.primary[400],
	},
}));

export const NavButtonIcon = styled('span')(({ theme }) => ({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	fontSize: '1.25rem', // asegura consistencia (20px aprox)
}));

