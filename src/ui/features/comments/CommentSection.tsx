import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import axios from 'axios';
import getEnvVariables from '../../../config/configEnvs';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
	CommentsWrapper, CommentCard, AuthorTxt, ContentTxt, DateTxt,
	ActionBox, CommentField, PrimaryBtn,
} from './commentSection.styles';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import {IconButton, Typography} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';   
import {Box} from '@mui/system';

interface Comment {
	_id: string;
	content: string;
	author: { _id: string; username: string };
	publication: string;
	created_at: string;
}

interface CommentSectionProps {
	publicationId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ publicationId }) => {
	const [comments, setComments] = useState<Comment[]>([]);
	const [newComment, setNewComment] = useState('');
	const [editingComment, setEditingComment] = useState<Comment | null>(null);
	const [editedContent, setEditedContent] = useState('');
	const [socket, setSocket] = useState<Socket | null>(null);

	const { HOST, SERVICE } = getEnvVariables();

	const authenticatedUserId = localStorage.getItem('userId');
	const token = localStorage.getItem('token');

	useEffect(() => {
		const fetchComments = async () => {
			try {
				const response = await axios.get(
					`${HOST}${SERVICE}/publications/${publicationId}/comments`,
					{
						headers: { Authorization: `Bearer ${token}` },
					}
				);
				setComments(response.data.comments || []);
			} catch (error) {
				console.error('Error fetching comments:', error);
				setComments([]);
			}
		};

		fetchComments();
	}, [publicationId, HOST, SERVICE, token]);

	// Funciones para manejar la conexión del socket
	const connectSocket = () => {
		if (!token || socket) return;

		const newSocket = io(HOST, {
			auth: {
				token,
			},
		});

		setSocket(newSocket);

		// Escuchar eventos de nuevos comentarios
		newSocket.on('new-comment', (comment: Comment) => {
			if (comment.publication === publicationId) {
				setComments((prevComments) => [...prevComments, comment]);
			}
		});

		// Escuchar notificaciones
		newSocket.on('new-notification', (notification) => {
			if (notification.data.publicationId === publicationId) {
				toast.info(notification.message);
			}
		});

		// Manejar errores de conexión
		newSocket.on('connect_error', (err) => {
			console.error('Error de conexión Socket.IO:', err.message);
		});

		// Manejar desconexión
		newSocket.on('disconnect', (reason) => {
			console.warn('Socket desconectado:', reason);
		});
	};

	const disconnectSocket = () => {
		if (socket) {
			socket.off('new-comment');
			socket.off('new-notification');
			socket.off('connect_error');
			socket.off('disconnect');
			socket.close();
			setSocket(null);
		}
	};

	useEffect(() => {
		return () => {
			// Al desmontar el componente, desconectar el socket si está conectado
			disconnectSocket();
		};
	}, []);


	const handleAddComment = async () => {
		if (!newComment.trim()) return;

		try {
			const response = await axios.post(
				`${HOST}${SERVICE}/publications/${publicationId}/comments`,
				{ content: newComment },
				{ headers: { Authorization: `Bearer ${token}` } }
			);

			const newCommentData = response.data.comment;
			setComments((prevComments) => [...prevComments, newCommentData]);
			setNewComment('');
		} catch (error) {
			console.error('Error adding comment:', error);

			// Verificar si el error es de Axios y si es un error de 400 (contenido inapropiado)
			if (axios.isAxiosError(error) && error.response && error.response.status === 400) {
				toast.warn(error.response.data.message || 'Comentario no permitido');
			} else {
				toast.error('Error al añadir el comentario');
			}
		}
	};

	// Función para manejar la edición de un comentario
	const handleEditComment = (comment: Comment) => {
		setEditingComment(comment);
		setEditedContent(comment.content);
	};

	// Función para manejar la actualización de un comentario
	const handleUpdateComment = async () => {
		if (!editingComment || !editedContent.trim()) return;

		try {
			const response = await axios.put(
				`${HOST}${SERVICE}/comments/${editingComment._id}`,
				{ content: editedContent },
				{ headers: { Authorization: `Bearer ${token}` } }
			);

			const updatedComment = response.data.comment;
			setComments((prevComments) =>
						prevComments.map((comment) =>
										 comment._id === updatedComment._id ? updatedComment : comment
										)
					   );
					   setEditingComment(null);
					   setEditedContent('');
		} catch (error) {
			console.error('Error updating comment:', error);

			if (axios.isAxiosError(error)) {
				if (error.response && error.response.status === 403) {
					toast.warn('No tienes permisos necesarios para realizar esta acccion ');
				} else {
					toast.error('Error al actualizar el comentario');
				}
			} else {
				toast.error('Ocurrió un error inesperado');
			}
		}
	};

	// Función para manejar la eliminación de un comentario
	const handleDeleteComment = async (commentId: string) => {
		try {
			await axios.delete(`${HOST}${SERVICE}/comments/${commentId}`, {
				headers: { Authorization: `Bearer ${token}` },
			});

			setComments((prevComments) => prevComments.filter((comment) => comment._id !== commentId));
		} catch (error) {
			console.error('Error deleting comment:', error);

			if (axios.isAxiosError(error)) {
				if (error.response && error.response.status === 403) {
					toast.warn('No tienes permiso necesarios para realizar esta accion');
				} else {
					toast.error('Error al eliminar el comentario');
				}
			} else {
				toast.error('Ocurrió un error inesperado');
			}
		}
	};

	return (
		<div>
			<Box sx={{ px: 2, pt: 2 }}>
  <Typography variant="h6">Comentarios</Typography>
			</Box>
			<CommentsWrapper>
				{comments.length > 0 ? (
					comments.map((comment) => (
						<CommentCard key={comment._id}>
							<AuthorTxt>{comment.author.username}</AuthorTxt>
							<ContentTxt>{comment.content}</ContentTxt>
							<DateTxt>{new Date(comment.created_at).toLocaleString()}</DateTxt>
							{authenticatedUserId === comment.author._id && (
								<ActionBox>
									<IconButton size="small" onClick={() => handleEditComment(comment)}> <EditIcon fontSize="small" /> 
									</IconButton>
									<IconButton size="small" onClick={() => handleDeleteComment(comment._id)}><DeleteIcon fontSize="small" />
									</IconButton>
								</ActionBox>
							)}
							{editingComment && editingComment._id === comment._id && (
								<>
									<CommentField
										multiline
										minRows={2}
										value={editedContent}
										onChange={(e) => setEditedContent(e.target.value)}
										placeholder="Editar comentario"
									/>
									<ActionBox>
										<IconButton color='primary' onClick={handleUpdateComment}>
											<SaveIcon fontSize='small'/>
										</IconButton>
										<IconButton onClick={() => setEditingComment(null)}>
											<CloseIcon fontSize="small"/>
										</IconButton>
									</ActionBox>
								</>
							)}
						</CommentCard>
					))
				) : (
				<Box sx={{ px: 2, pt: 2 }}>
					<Typography>No hay comentarios aún. ¡Sé el primero en comentar!</Typography>
				</Box>
				)}
			</CommentsWrapper>
			<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1, px: 2, mb: 2 }}>
			<CommentField
				multiline
				minRows={2}
				value={newComment}
				onChange={(e) => setNewComment(e.target.value)}
				placeholder="Añadir un comentario"
				onFocus={connectSocket}
				onBlur={disconnectSocket}
			/>
			<PrimaryBtn variant='contained' onClick={handleAddComment} endIcon={<SendIcon/>} ></PrimaryBtn>
				</Box>
			<ToastContainer />
		</div>
	);
};

export default CommentSection;

