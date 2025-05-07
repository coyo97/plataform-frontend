// src/ui/components/auth/loginForm/formLogin.styles.ts

import { styled } from '@mui/system';
import { Theme } from '@mui/material/styles';
import mq from '../../../../config/mq';

const FormWrapper = styled('form')(({ theme }: { theme?: Theme }) => ({
	backgroundColor: theme?.palette.colorForm.main || '#FFFFFF',
	borderRadius: theme?.shape.borderRadius || '8px',
	boxShadow: theme?.shadows[3] || '0 4px 8px rgba(0,0,0,0.1)',
	padding: '30px',
	display: 'flex',
	flexDirection: 'column',
	gap: '20px',
	width: '100%',
	maxWidth: '400px',
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	[mq('xxs', 'max')]: {
		width: '100%',
	},
}));

const FormTitle = styled('h1')(({ theme }: { theme?: Theme }) => ({
	fontSize: '24px',
	color: theme?.palette.primary.main || '#003366',
	marginBottom: '16px',
	textAlign: 'center',
	fontFamily: theme?.typography.fontFamily || 'sans-serif',
}));

const FormInput = styled('input')(({ theme }: { theme?: Theme }) => ({
	padding: '12px',
	borderRadius: '4px',
	border: `1px solid ${theme?.palette.divider || '#ddd'}`,
	width: '100%',
	fontSize: '16px',
	color: theme?.palette.text.primary || '#000',
	'&:focus': {
		borderColor: theme?.palette.primary.main || '#003366',
		outline: 'none',
		boxShadow: `0 0 5px ${theme?.palette.primary.main || '#003366'}33`,
	},
}));

const SubmitButton = styled('button')(({ theme }: { theme?: Theme }) => ({
	padding: '12px',
	borderRadius: '4px',
	border: 'none',
	backgroundColor: theme?.palette.colorButton.main || '#003366',
	color: theme?.palette.primary.contrastText || '#FFFFFF',
	fontSize: '16px',
	cursor: 'pointer',
	fontFamily: theme?.typography.fontFamily || 'sans-serif',
	transition: 'background-color 0.3s ease',
	'&:hover': {
		backgroundColor: theme?.palette.colorButton.second || '#CC0000',
	},
}));

const FormLabel = styled('label')(({ theme }: { theme?: Theme }) => ({
	color: theme?.palette.text.primary || '#333',
	fontSize: '16px',
	marginBottom: '8px',
	fontFamily: theme?.typography.fontFamily || 'sans-serif',
}));

export { FormWrapper, FormTitle, FormInput, SubmitButton, FormLabel };

