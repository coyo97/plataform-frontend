// src/ui/components/admin/userManagement.styles.ts
import { styled } from '@mui/system';
import { Theme } from '@mui/material/styles';
import mq from '../../../config/mq';

export const Container = styled('div')(({ theme }: { theme?: Theme }) => ({
	backgroundColor: theme?.palette.colorForm.main,
	borderRadius: theme?.shape.borderRadius,
	padding: '20px',
	[mq('xxs', 'max')]: {
		padding: '10px',
		width: '100%',
	},
	[mq('md', 'min')]: {
		width: '80%',
		margin: '0 auto',
	},
}));

export const Title = styled('h2')(({ theme }: { theme?: Theme }) => ({
	color: theme?.palette.primary.contrastText,
	textAlign: 'center',
	marginBottom: '20px',
}));

export const Table = styled('table')({
	width: '100%',
	borderCollapse: 'collapse',
	marginTop: '10px',
});

export const TableRow = styled('tr')({
	'&:nth-of-type(even)': {
		backgroundColor: '#f2f2f2',
	},
});

export const TableHeader = styled('th')({
	padding: '12px',
	textAlign: 'left',
	borderBottom: '1px solid #ddd',
});

export const TableCell = styled('td')({
	padding: '12px',
	borderBottom: '1px solid #ddd',
});

export const Button = styled('button')(({ theme }: { theme?: Theme }) => ({
	padding: '8px 16px',
	margin: '5px',
	borderRadius: '4px',
	border: 'none',
	cursor: 'pointer',
	backgroundColor: theme?.palette.colorButton.main,
	color: theme?.palette.primary.contrastText,
	'&:hover': {
		backgroundColor: theme?.palette.colorButton.second,
	},
}));

