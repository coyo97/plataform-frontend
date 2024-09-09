import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPublication } from '../../../async/services/publicationService';

const CreatePublication: React.FC = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
		console.log('Publicación creada:', { title, content });

        const tagsArray = tags.split(',').map(tag => tag.trim()); // Convertir las etiquetas a un array
        const payload = { title, content, tags: tagsArray };

        try {
            // Enviar la publicación al backend
            await createPublication('http://localhost:8000/v1.0/api/publications', payload);
            navigate('/publications'); // Redirigir a la página de publicaciones o mostrar un mensaje de éxito
        } catch (error) {
            console.error('Error creating publication:', error);
            // Aquí puedes añadir manejo de errores, mostrar un mensaje, etc.
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Título"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
            />
            <textarea
                placeholder="Contenido"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
            ></textarea>
            <input
                type="text"
                placeholder="Etiquetas (separadas por comas)"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
            />
            <button type="submit">Crear Publicación</button>
        </form>
    );
};

export default CreatePublication;

