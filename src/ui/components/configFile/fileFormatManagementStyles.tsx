// src/components/admin/fileFormatManagementStyles.tsx

import { styled } from '@mui/material/styles';
import mq from '../../../config/mq';

export const Container = styled('div')(({ theme }) => ({
	padding: '20px',
	backgroundColor: theme.palette.background.default,
	maxWidth: '800px',
	margin: '0 auto',
	[mq('sm', 'max')]: {
		padding: '10px',
	},
}));

export const Title = styled('h2')(({ theme }) => ({
	color: theme.palette.primary.main,
	textAlign: 'center',
	marginBottom: '20px',
	[mq('sm', 'max')]: {
		fontSize: '1.5rem',
		textAlign: 'left',
	},
}));

export const SubTitle = styled('h3')(({ theme }) => ({
	color: theme.palette.secondary.main,
	marginBottom: '10px',
	[mq('sm', 'max')]: {
		fontSize: '1.2rem',
	},
}));

export const Input = styled('input')(({ theme }) => ({
	width: '100%',
	padding: '10px',
	marginBottom: '10px',
	borderRadius: '4px',
	border: `1px solid ${theme.palette.divider}`,
	fontSize: '16px',
	[mq('md', 'max')]: {
		fontSize: '14px',
	},
}));

export const Table = styled('table')({
	width: '100%',
	borderCollapse: 'collapse',
});

export const TableHeader = styled('th')(({ theme }) => ({
	backgroundColor: theme.palette.primary.main,
	color: theme.palette.primary.contrastText,
	padding: '10px',
	border: `1px solid ${theme.palette.divider}`,
	fontSize: '1rem',
	[mq('sm', 'max')]: {
		fontSize: '0.875rem',
		padding: '8px',
	},
}));

export const TableRow = styled('tr')(({ theme }) => ({
	'&:nth-of-type(even)': {
		backgroundColor: theme.palette.action.hover,
	},
	[mq('sm', 'max')]: {
		display: 'block', // Ajuste para pantallas pequeñas
		marginBottom: '10px',
	},
}));

export const TableCell = styled('td')(({ theme }) => ({
	padding: '10px',
	border: `1px solid ${theme.palette.divider}`,
	color: theme.palette.text.primary,
	[mq('sm', 'max')]: {
		padding: '8px',
		fontSize: '0.875rem',
	},
}));

export const Button = styled('button')(({ theme }) => ({
	padding: '8px 16px',
	borderRadius: '4px',
	border: 'none',
	backgroundColor: theme.palette.colorButton.main,
	color: theme.palette.primary.contrastText,
	cursor: 'pointer',
	marginBottom: '10px',
	fontSize: '0.875rem', // Ajustar tamaño de fuente
	width: 'auto', // Ajustar automáticamente el ancho
	maxWidth: '150px', // Limitar ancho en móviles
	'&:hover': {
		backgroundColor: theme.palette.primary.dark,
	},
	[mq('sm', 'max')]: {
		width: '100%', // Botón ocupa todo el ancho en móviles
		padding: '6px 12px', // Reducir padding en móviles
		fontSize: '0.75rem', // Reducir tamaño de fuente en móviles
	},
}));

export const ActionButton = styled('button')(({ theme }) => ({
	padding: '5px 10px',
	borderRadius: '4px',
	border: 'none',
	backgroundColor: theme.palette.secondary.main,
	color: theme.palette.secondary.contrastText,
	cursor: 'pointer',
	margin: '5px 0', // Ajustar márgenes para mejor separación
	fontSize: '0.8rem',
	'&:hover': {
		backgroundColor: theme.palette.secondary.dark,
	},
	[mq('sm', 'max')]: {
		width: '100%', // Botón ocupa todo el ancho en móviles
		padding: '4px 8px', // Reducir padding
		fontSize: '0.75rem', // Reducir tamaño de fuente
	},
}));

