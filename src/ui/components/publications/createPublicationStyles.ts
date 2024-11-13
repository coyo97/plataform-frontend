import { Box, Button, Input, TextareaAutosize, Typography, styled } from '@mui/material';

export const FormContainer = styled('form')({
	display: 'flex',
	flexDirection: 'column',
	gap: '15px',
	maxWidth: '500px',
	margin: 'auto',
	padding: '20px',
	border: '1px solid #ddd',
	borderRadius: '8px',
	boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
	backgroundColor: '#fff',
});

export const FormTitle = styled(Typography)({
	fontSize: '24px',
	fontWeight: 'bold',
	textAlign: 'center',
	color: '#333',
});

export const InputField = styled(Input)({
	padding: '10px',
	fontSize: '16px',
	borderRadius: '4px',
	border: '1px solid #ddd',
});

export const TextArea = styled(TextareaAutosize)({
	padding: '10px',
	fontSize: '16px',
	borderRadius: '4px',
	border: '1px solid #ddd',
	resize: 'vertical',
});

export const SelectField = styled('select')({
	padding: '10px',
	fontSize: '16px',
	borderRadius: '4px',
	border: '1px solid #ddd',
});

export const FileInput = styled(Input)({
	padding: '10px',
	fontSize: '16px',
});

export const SubmitButton = styled(Button)({
	padding: '10px 20px',
	fontSize: '16px',
	color: '#fff',
	backgroundColor: '#3f51b5',
	'&:hover': {
		backgroundColor: '#303f9f',
	},
});

