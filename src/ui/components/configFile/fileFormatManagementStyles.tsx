// src/components/admin/fileFormatManagementStyles.tsx

import { styled } from '@mui/material/styles';
import mq from '../../../config/mq';

export const Container = styled('div')(({ theme }) => ({
	padding: '20px',
	backgroundColor: theme.palette.background.default,
	maxWidth: '800px',
	margin: '0 auto',
}));

export const Title = styled('h2')(({ theme }) => ({
	color: theme.palette.primary.main,
	textAlign: 'center',
	marginBottom: '20px',
}));

export const SubTitle = styled('h3')(({ theme }) => ({
	color: theme.palette.secondary.main,
	marginBottom: '10px',
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

export const Button = styled('button')(({ theme }) => ({
	padding: '10px 20px',
	borderRadius: '4px',
	border: 'none',
	backgroundColor: theme.palette.colorButton.main,
	color: theme.palette.primary.contrastText,
	cursor: 'pointer',
	marginBottom: '20px',
	'&:hover': {
		backgroundColor: theme.palette.primary.dark,
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
}));

export const TableRow = styled('tr')(({ theme }) => ({
	'&:nth-of-type(even)': {
		backgroundColor: theme.palette.action.hover,
	},
}));

export const TableCell = styled('td')(({ theme }) => ({
	padding: '10px',
	border: `1px solid ${theme.palette.divider}`,
	color: theme.palette.text.primary,
}));

export const ActionButton = styled('button')(({ theme }) => ({
	padding: '5px 10px',
	borderRadius: '4px',
	border: 'none',
	backgroundColor: theme.palette.secondary.main,
	color: theme.palette.secondary.contrastText,
	cursor: 'pointer',
	marginLeft: '5px',
	'&:hover': {
		backgroundColor: theme.palette.secondary.dark,
	},
}));

