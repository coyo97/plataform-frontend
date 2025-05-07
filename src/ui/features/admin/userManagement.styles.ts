// src/ui/components/admin/userManagement.styles.ts
import { TableRow, TableCell, TableContainer, Typography, Box, Button, styled } from '@mui/material';
import mq from '../../../config/mq';

export const UserManagementContainer = styled(Box)(({ theme }) => ({
	padding: theme.spacing(3),
	backgroundColor: theme.palette.background.default,
	color: theme.palette.text.primary,
	height: '100vh', // Altura completa para que el contenedor ocupe el espacio restante
	overflowY: 'auto', // Permite desplazamiento solo en el contenedor principal, no en el sidebar
	[mq('sm', 'max')]: {
		padding: theme.spacing(2),
		marginLeft: '0', // Sin margen en pantallas pequeñas para permitir que el sidebar sea colapsable
	},
}));


export const FilterButton = styled(Button)<{ active?: boolean }>`
	background-color: ${({ active }) => (active ? '#1976d2' : '#f0f0f0')};
	color: ${({ active }) => (active ? '#fff' : '#000')};
	margin: 5px;
	&:hover {
		background-color: ${({ active }) => (active ? '#1565c0' : '#e0e0e0')};
	}
`;
export const Title = styled(Typography)({
	fontWeight: 'bold',
	marginBottom: '1rem',
	[mq('md', 'max')]: {
		fontSize: '1.25rem', // Ajuste para pantallas medianas
	},
	[mq('lg', 'min')]: {
		fontSize: '1.5rem', // Ajuste para pantallas grandes
	},
});

export const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
	boxShadow: theme.shadows[3],
	borderRadius: theme.shape.borderRadius,
	backgroundColor: theme.palette.background.paper,
	 overflowX: 'auto',
	display: 'flex',
	flexDirection: 'column',
}));

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
	borderBottom: `1px solid ${theme.palette.divider}`,
	'&:nth-of-type(even)': {
		backgroundColor: theme.palette.action.hover,
	},
	[mq('md', 'max')]: {
		display: 'block',
		padding: theme.spacing(2),
	},
}));

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
	padding: theme.spacing(1),
	textAlign: 'left',
	fontWeight: 'bold',
	color: theme.palette.text.primary,
	[mq('sm', 'max')]: {
		fontSize: '0.8rem', // Ajuste para pantallas pequeñas
		fontWeight: 'normal',
	},
	[mq('md', 'max')]: {
		fontSize: '0.9rem', // Ajuste para pantallas medianas
	},
	[mq('lg', 'min')]: {
		fontSize: '1rem', // Ajuste para pantallas grandes
	},
}));

export const ActionButtonContainer = styled(Box)(({ theme }) => ({
	display: 'flex',
	gap: theme.spacing(1),
	[mq('md', 'max')]: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		width: '100%',
	},
}));

export const ActionButton = styled(Button)(({ theme }) => ({
	color: theme.palette.primary.contrastText,
	backgroundColor: theme.palette.colorButton.main,
	'&:hover': {
		backgroundColor: theme.palette.colorButton.second,
	},
	[mq('md', 'max')]: {
		flexGrow: 1,
		fontSize: '0.8rem', // Ajuste para pantallas medianas
		padding: theme.spacing(0.5),
		marginBottom: theme.spacing(0.5),
	},
	[mq('lg', 'min')]: {
		fontSize: '0.9rem', // Ajuste para pantallas grandes
		padding: theme.spacing(1),
	},
}));

