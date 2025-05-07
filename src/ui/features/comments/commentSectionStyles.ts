import { styled } from '@mui/system';
import mq from '../../../config/mq';

export const CommentContainer = styled('div')({
	padding: '10px 0',
	borderBottom: '1px solid #ddd',
	marginBottom: '10px',
	[mq('sm', 'min')]: {
		padding: '15px 0',
	},
});

export const CommentAuthor = styled('strong')(({ theme }) => ({
	color: theme.palette.secondary.main,
	fontSize: '14px',
	[mq('sm', 'min')]: {
		fontSize: '16px',
	},
}));

export const CommentText = styled('p')({
	margin: '5px 0',
	fontSize: '14px',
	lineHeight: '1.4',
	[mq('sm', 'min')]: {
		fontSize: '16px',
	},
});

export const CommentDate = styled('small')({
	display: 'block',
	fontSize: '12px',
	color: '#888',
	marginTop: '5px',
	[mq('sm', 'min')]: {
		fontSize: '14px',
	},
});

export const CommentButtonGroup = styled('div')({
	display: 'flex',
	gap: '10px',
	marginTop: '10px',
});

export const CommentButton = styled('button')(({ theme }) => ({
	padding: '6px 12px',
	fontSize: '12px',
	backgroundColor: theme.palette.colorButton.main,
	color: theme.palette.common.white,
	border: 'none',
	borderRadius: '5px',
	cursor: 'pointer',
	[mq('sm', 'min')]: {
		padding: '8px 15px',
		fontSize: '14px',
	},
	'&:hover': {
		backgroundColor: theme.palette.colorButton.second,
	},
}));

export const CommentTextarea = styled('textarea')({
	width: '100%',
	padding: '10px',
	fontSize: '14px',
	borderRadius: '5px',
	border: '1px solid #ddd',
	marginTop: '10px',
	[mq('sm', 'min')]: {
		fontSize: '16px',
		padding: '12px',
	},
});

// Estilo nuevo para contenedor con scroll
export const CommentsWrapper = styled('div')({
	maxHeight: '300px', // Ajusta la altura máxima del contenedor de comentarios
	overflowY: 'auto',  // Permite el desplazamiento vertical
	paddingRight: '10px',
	marginTop: '10px',
	border: '1px solid #ddd',
	borderRadius: '5px',
});

