// src/ui/components/comments/CommentSection.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import getEnvVariables from '../../../config/configEnvs';

interface Comment {
    _id: string;
    content: string;
    author: { username: string };
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

	const {HOST, SERVICE} = getEnvVariables();

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await axios.get(
                    `${HOST}${SERVICE}/publications/${publicationId}/comments`,
                    {
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                    }
                );
                setComments(response.data.comments || []); // Asegúrate de establecer siempre un array
            } catch (error) {
                console.error('Error fetching comments:', error);
                setComments([]); // Asegúrate de manejar el estado correctamente en caso de error
            }
        };

        fetchComments();
    }, [publicationId]);

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
            setNewComment(''); // Limpia el campo de comentario después de agregarlo
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
            {comments.length > 0 ? (
                comments.map((comment) => (
                    <div key={comment._id}>
                        <p>
                            <strong>{comment.author.username}</strong>: {comment.content}
                        </p>
                        <small>{new Date(comment.created_at).toLocaleString()}</small>
                        <div>
                            <button onClick={() => handleEditComment(comment)}>Editar</button>
                            <button onClick={() => handleDeleteComment(comment._id)}>Eliminar</button>
                        </div>
                        {editingComment && editingComment._id === comment._id && (
                            <div>
                                <textarea
                                    value={editedContent}
                                    onChange={(e) => setEditedContent(e.target.value)}
                                    placeholder="Editar comentario"
                                />
                                <button onClick={handleUpdateComment}>Guardar</button>
                                <button onClick={() => setEditingComment(null)}>Cancelar</button>
                            </div>
                        )}
                    </div>
                ))
            ) : (
                <p>No hay comentarios aún. ¡Sé el primero en comentar!</p>
            )}
            <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Añadir un comentario"
            />
            <button onClick={handleAddComment}>Enviar</button>
        </div>
    );
};

export default CommentSection;

