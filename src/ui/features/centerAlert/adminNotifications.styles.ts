// src/ui/components/centerAlert/adminNotifications.styles.ts
import { Box, Button, TextField, Typography, styled, Select } from '@mui/material';

export const Container = styled(Box)(({ theme }) => ({
	padding: theme.spacing(3),
	backgroundColor: theme.palette.background.paper,
	borderRadius: theme.shape.borderRadius,
	boxShadow: theme.shadows[2],
	maxWidth: '500px',
	margin: '0 auto',
}));

export const Title = styled(Typography)(({ theme }) => ({
	fontSize: '1.5rem',
	fontWeight: 'bold',
	marginBottom: theme.spacing(2),
	color: theme.palette.text.primary,
	textAlign: 'center',
}));

export const FormControl = styled(Box)(({ theme }) => ({
	display: 'flex',
	flexDirection: 'column',
	marginBottom: theme.spacing(2),
}));

export const StyledSelect = styled(Select)(({ theme }) => ({
	marginBottom: theme.spacing(2),
}));

export const MessageInput = styled(TextField)(({ theme }) => ({
	marginBottom: theme.spacing(2),
}));

export const SendButton = styled(Button)(({ theme }) => ({
	backgroundColor: theme.palette.primary.main,
	color: theme.palette.primary.contrastText,
	'&:hover': {
		backgroundColor: theme.palette.primary.dark,
	},
}));

