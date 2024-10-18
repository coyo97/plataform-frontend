import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import axios from 'axios';
import { 
  CommentContainer, 
  CommentAuthor, 
  CommentText, 
  CommentDate, 
  CommentButtonGroup, 
  CommentButton, 
  CommentTextarea, 
  CommentsWrapper // Importa el contenedor con scroll
} from './commentSectionStyles'; // Importa los estilos
import getEnvVariables from '../../../config/configEnvs';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                    }
                );
                setComments(response.data.comments || []);
            } catch (error) {
                console.error('Error fetching comments:', error);
                setComments([]);
            }
        };

        fetchComments();
    }, [publicationId, HOST, SERVICE]);

	  // Configurar Socket.IO
  useEffect(() => {
    if (!token) return;

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

    return () => {
      newSocket.off('new-comment');
      newSocket.off('new-notification');
      newSocket.close();
    };
  }, [publicationId, token, HOST]);

    const handleAddComment = async () => {
        if (!newComment.trim()) return;

        try {
            const response = await axios.post(
                `${HOST}${SERVICE}/publications/${publicationId}/comments`,
                { content: newComment },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );

            const newCommentData = response.data.comment;
            setComments((prevComments) => [...prevComments, newCommentData]);
            setNewComment('');
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        try {
            await axios.delete(`${HOST}${SERVICE}/comments/${commentId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });

            setComments((prevComments) => prevComments.filter((comment) => comment._id !== commentId));
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    const handleEditComment = (comment: Comment) => {
        setEditingComment(comment);
        setEditedContent(comment.content);
    };

    const handleUpdateComment = async () => {
        if (!editingComment || !editedContent.trim()) return;

        try {
            const response = await axios.put(
                `${HOST}${SERVICE}/comments/${editingComment._id}`,
                { content: editedContent },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
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
        }
    };

    return (
        <div>
            <h3>Comentarios</h3>
            {/* Envolver los comentarios con el contenedor de scroll */}
            <CommentsWrapper>
                {comments.length > 0 ? (
                    comments.map((comment) => (
                        <CommentContainer key={comment._id}>
                            <CommentAuthor>{comment.author.username}</CommentAuthor>
                            <CommentText>{comment.content}</CommentText>
                            <CommentDate>{new Date(comment.created_at).toLocaleString()}</CommentDate>
                            {authenticatedUserId === comment.author._id && (
                                <CommentButtonGroup>
                                    <CommentButton onClick={() => handleEditComment(comment)}>Editar</CommentButton>
                                    <CommentButton onClick={() => handleDeleteComment(comment._id)}>Eliminar</CommentButton>
                                </CommentButtonGroup>
                            )}
                            {editingComment && editingComment._id === comment._id && (
                                <div>
                                    <CommentTextarea
                                        value={editedContent}
                                        onChange={(e) => setEditedContent(e.target.value)}
                                        placeholder="Editar comentario"
                                    />
                                    <CommentButtonGroup>
                                        <CommentButton onClick={handleUpdateComment}>Guardar</CommentButton>
                                        <CommentButton onClick={() => setEditingComment(null)}>Cancelar</CommentButton>
                                    </CommentButtonGroup>
                                </div>
                            )}
                        </CommentContainer>
                    ))
                ) : (
                    <p>No hay comentarios aún. ¡Sé el primero en comentar!</p>
                )}
            </CommentsWrapper>
            <CommentTextarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Añadir un comentario"
            />
            <CommentButton onClick={handleAddComment}>Enviar</CommentButton>
        </div>
    );
};

export default CommentSection;

