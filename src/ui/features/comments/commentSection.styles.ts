// src/ui/components/comments/commentSection.styles.ts
import { styled } from '@mui/material/styles';
import {
	Paper, IconButton, TextField, Button, Box, Typography,
} from '@mui/material';
import mq from '../../../config/mq';

/* Contenedor que aloja todos los comentarios (scroll) */
export const CommentsWrapper = styled(Box)(({ theme }) => ({
	maxHeight: 300,
	overflowY: 'auto',
	marginTop: theme.spacing(2),
	paddingRight: theme.spacing(1),
	border: `1px solid ${theme.palette.divider}`,
	borderRadius: theme.shape.borderRadius,
}));

/* Tarjeta para cada comentario */
export const CommentCard = styled(Paper)(({ theme }) => ({
	padding: theme.spacing(1.5),
	marginBottom: theme.spacing(1.5),
	borderRadius: theme.shape.borderRadius * 1.5,
	boxShadow: theme.shadows[1],
	background: theme.palette.background.paper,
}));

export const AuthorTxt = styled(Typography)(({ theme }) => ({
	fontWeight: 600,
	color: theme.palette.secondary.main,
	fontSize: 14,
	[mq('sm', 'min')]: { fontSize: 16 },
}));

export const ContentTxt = styled(Typography)(({ theme }) => ({
	marginTop: theme.spacing(0.5),
	fontSize: 14,
	[mq('sm', 'min')]: { fontSize: 16 },
}));

export const DateTxt = styled(Typography)(({ theme }) => ({
	marginTop: theme.spacing(0.5),
	fontSize: 12,
	color: theme.palette.text.secondary,
	[mq('sm', 'min')]: { fontSize: 14 },
}));

/* Grupo de acciones (editar / eliminar / etc.) */
export const ActionBox = styled(Box)(({ theme }) => ({
	display: 'flex',
	gap: theme.spacing(1),
	marginTop: theme.spacing(1),
}));

/* Campo de texto (nuevo comentario o edición) */
export const CommentField = styled(TextField)({
	width: '100%',
});

/* Botón enviado / guardado */
export const PrimaryBtn = styled(Button)(({ theme }) => ({
	marginTop: theme.spacing(1),
	alignSelf: 'flex-end',
}));

