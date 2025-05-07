// src/ui/components/publications/user/userMaterialsStyles.tsx

import { styled } from '@mui/material/styles';

export const Container = styled('div')({
	padding: '20px',
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
});

export const PublicationCard = styled('div')(({ theme }) => ({
	marginBottom: '20px',
	padding: '20px',
	width: '100%',
	maxWidth: '600px',
	backgroundColor: theme.palette.background.paper,
	borderRadius: '8px',
	boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
}));

export const PublicationTitle = styled('h2')(({ theme }) => ({
	color: theme.palette.primary.main,
	fontFamily: theme.typography.fontFamily,
	marginBottom: '10px',
}));

export const PublicationContent = styled('p')({
	fontSize: '16px',
	marginBottom: '10px',
});

export const Tags = styled('p')({
	fontSize: '14px',
	color: '#888',
});

export const EditButton = styled('button')(({ theme }) => ({
	marginRight: '10px',
	padding: '8px 16px',
	backgroundColor: theme.palette.primary.main,
	color: theme.palette.primary.contrastText,
	border: 'none',
	borderRadius: '4px',
	cursor: 'pointer',
	'&:hover': {
		backgroundColor: theme.palette.primary.dark,
	},
}));

export const DeleteButton = styled(EditButton)(({ theme }) => ({
	backgroundColor: theme.palette.secondary.main,
	'&:hover': {
		backgroundColor: theme.palette.secondary.dark,
	},
}));

export const EditForm = styled('div')({
	marginTop: '20px',
	display: 'flex',
	flexDirection: 'column',
	gap: '10px',
});

export const Input = styled('input')({
	padding: '10px',
	borderRadius: '4px',
	border: '1px solid #ddd',
	fontSize: '16px',
	width: '100%',
});

export const TextArea = styled('textarea')({
	padding: '10px',
	borderRadius: '4px',
	border: '1px solid #ddd',
	fontSize: '16px',
	width: '100%',
	minHeight: '100px',
});

export const FileInput = styled('input')({
	fontSize: '16px',
});

export const UpdateButton = styled(EditButton)({
	marginTop: '10px',
	alignSelf: 'flex-start',
});

export const CancelButton = styled(DeleteButton)({
	alignSelf: 'flex-start',
});

