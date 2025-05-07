// src/ui/components/admin/reportThresholdSettingsStyles.tsx

import { styled } from '@mui/material/styles';
import mq from '../../../config/mq';

export const Container = styled('div')(({ theme }) => ({
	padding: '20px',
	backgroundColor: theme.palette.background.default,
	maxWidth: '600px',
	margin: '0 auto',
	borderRadius: '8px',
	boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
}));

export const Title = styled('h2')(({ theme }) => ({
	color: theme.palette.primary.main,
	textAlign: 'center',
	marginBottom: '20px',
	fontFamily: theme.typography.fontFamily,
}));

export const Label = styled('label')(({ theme }) => ({
	display: 'block',
	color: theme.palette.text.primary,
	fontSize: '16px',
	marginBottom: '10px',
	fontFamily: theme.typography.fontFamily,
}));

export const Input = styled('input')(({ theme }) => ({
	width: '100%',
	padding: '10px',
	borderRadius: '4px',
	border: `1px solid ${theme.palette.divider}`,
	fontSize: '16px',
	marginBottom: '20px',
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
	fontFamily: theme.typography.fontFamily,
	fontSize: '16px',
	display: 'block',
	margin: '20px auto 0 auto',
	'&:hover': {
		backgroundColor: theme.palette.colorButton.second,
	},
}));

