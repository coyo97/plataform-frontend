// src/ui/components/careers/careerManagerStyles.tsx

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

export const Textarea = styled('textarea')(({ theme }) => ({
	width: '100%',
	padding: '10px',
	marginBottom: '10px',
	borderRadius: '4px',
	border: `1px solid ${theme.palette.divider}`,
	fontSize: '16px',
	resize: 'vertical',
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

export const CareerList = styled('ul')({
	listStyle: 'none',
	padding: 0,
});

export const CareerItem = styled('li')(({ theme }) => ({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-between',
	padding: '10px',
	borderBottom: `1px solid ${theme.palette.divider}`,
	'&:hover': {
		backgroundColor: theme.palette.action.hover,
	},
}));

export const CareerName = styled('span')({
	fontWeight: 500,
	fontSize: '16px',
	flex: 1,
});

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


export const Select = styled('select')(({ theme }) => ({
	width: '100%',
	padding: '10px',
	marginBottom: '10px',
	borderRadius: '4px',
	border: `1px solid ${theme.palette.divider}`,
	fontSize: '16px',
	backgroundColor: theme.palette.background.paper,
	[mq('md', 'max')]: {
		fontSize: '14px',
	},
}));

export const Option = styled('option')({
	fontSize: '16px',
});

export const List = styled('ul')({
	listStyle: 'none',
	padding: 0,
	marginTop: '20px',
});

export const Item = styled('li')(({ theme }) => ({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-between',
	padding: '10px',
	borderBottom: `1px solid ${theme.palette.divider}`,
	'&:hover': {
		backgroundColor: theme.palette.action.hover,
	},
}));
