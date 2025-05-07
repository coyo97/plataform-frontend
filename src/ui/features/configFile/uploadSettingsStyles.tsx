// src/components/admin/uploadSettingsStyles.tsx

import { styled } from '@mui/material/styles';
import mq from '../../../config/mq';

export const Container = styled('div')(({ theme }) => ({
	padding: '20px',
	backgroundColor: theme.palette.background.default,
	maxWidth: '600px',
	margin: '0 auto',
	[mq('sm', 'max')]: {
		padding: '15px',
		maxWidth: '100%', // Ocupa todo el ancho en móviles
	},
}));

export const Title = styled('h2')(({ theme }) => ({
	color: theme.palette.primary.main,
	textAlign: 'center',
	marginBottom: '20px',
	fontSize: '1.5rem',
	[mq('sm', 'max')]: {
		fontSize: '1.25rem', // Ajustar tamaño de fuente en móviles
		textAlign: 'left', // Alineación a la izquierda en móviles
	},
}));

export const Label = styled('label')(({ theme }) => ({
	display: 'block',
	color: theme.palette.text.primary,
	fontSize: '16px',
	marginBottom: '10px',
	[mq('sm', 'max')]: {
		fontSize: '14px', // Reducir tamaño de fuente en móviles
	},
}));

export const Input = styled('input')(({ theme }) => ({
	width: '100%',
	padding: '10px',
	borderRadius: '4px',
	border: `1px solid ${theme.palette.divider}`,
	fontSize: '16px',
	marginBottom: '20px',
	[mq('sm', 'max')]: {
		padding: '8px',
		fontSize: '14px', // Reducir tamaño de fuente en móviles
	},
}));

export const ButtonContainer = styled('div')(({ theme }) => ({
	display: 'flex',
	justifyContent: 'flex-start', // Botón alineado al lado izquierdo
	alignItems: 'center',
	marginTop: '10px',
	[mq('sm', 'max')]: {
		marginTop: '5px',
	},
}));

export const Button = styled('button')(({ theme }) => ({
	padding: '10px 20px',
	borderRadius: '4px',
	border: 'none',
	backgroundColor: theme.palette.colorButton.main,
	color: theme.palette.primary.contrastText,
	cursor: 'pointer',
	fontSize: '1rem',
	'&:hover': {
		backgroundColor: theme.palette.primary.dark,
	},
	[mq('sm', 'max')]: {
		padding: '8px 16px', // Reducir padding en móviles
		fontSize: '0.875rem', // Reducir tamaño de fuente en móviles
		width: 'auto', // Mantener ancho dinámico
	},
}));

