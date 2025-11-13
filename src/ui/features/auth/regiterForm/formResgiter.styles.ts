// src/ui/features/auth/regiterForm/formResgiter.styles.ts
import { styled } from '@mui/system';
import { Theme } from '@mui/material/styles';

const FormWrapper = styled('form')(({ theme }: { theme?: Theme }) => ({
	backgroundColor: theme?.palette.colorForm?.main || '#FFFFFF',
	borderRadius: theme?.shape.borderRadius || 8,
	boxShadow: theme?.shadows[2] || '0 2px 6px rgba(0,0,0,0.08)',
	padding: '20px',
	display: 'flex',
	flexDirection: 'column',
	gap: 16,
	width: '100%',
	maxWidth: 420,
	boxSizing: 'border-box',
	margin: '24px auto 40px', // se centra horizontalmente, pero YA NO está absoluto
}));

const FormTitle = styled('h1')(({ theme }: { theme?: Theme }) => ({
	fontSize: '20px',
	color: theme?.palette.primary.main || '#003366',
	marginBottom: 8,
	textAlign: 'center',
	fontFamily: theme?.typography.fontFamily || 'sans-serif',
	fontWeight: 600,
}));

const FormInput = styled('input')(({ theme }: { theme?: Theme }) => ({
	borderRadius: 4,
	border: `1px solid ${theme?.palette.divider || '#ccc'}`,
	width: '100%',
	boxSizing: 'border-box',
	color: theme?.palette.text.primary || '#000',
	fontSize: '14px',
	padding: '7px 10px',
	height: '36px',

	'&:focus': {
		borderColor: theme?.palette.primary.main || '#003366',
		outline: 'none',
		boxShadow: `0 0 3px ${theme?.palette.primary.main || '#003366'}33`,
	},
}));

const SubmitButton = styled('button')(({ theme }: { theme?: Theme }) => ({
	borderRadius: 4,
	border: 'none',
	backgroundColor: theme?.palette.colorButton?.main || '#003366',
	color: theme?.palette.primary.contrastText || '#FFFFFF',
	fontFamily: theme?.typography.fontFamily || 'sans-serif',
	cursor: 'pointer',
	transition: 'background-color 0.25s ease, transform 0.1s ease',
	fontSize: '14px',
	padding: '9px',
	marginTop: 6,

	'&:hover': {
		backgroundColor: theme?.palette.colorButton?.second || '#016A6A',
		transform: 'translateY(-1px)',
	},
	'&:active': {
		transform: 'translateY(0)',
	},
}));

const FormLabel = styled('label')(({ theme }: { theme?: Theme }) => ({
	color: theme?.palette.text.primary || '#333',
	display: 'block',
	fontFamily: theme?.typography.fontFamily || 'sans-serif',
	fontSize: '14px',
	marginBottom: 4,
}));

export { FormWrapper, FormTitle, FormInput, SubmitButton, FormLabel };

