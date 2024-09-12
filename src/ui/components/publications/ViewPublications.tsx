import React, { useEffect, useState } from 'react';
import { getPublications } from '../../../async/services/publicationService';

interface Publication {
    _id: string;
    title: string;
    content: string;
    tags: string[];
    author: {
        username: string;
    };
    filePath?: string; // Ruta al archivo
    fileType?: string; // Tipo de archivo (opcional)
}

const ViewPublications: React.FC = () => {
    const [publications, setPublications] = useState<Publication[]>([]);

    useEffect(() => {
        const fetchPublications = async () => {
            try {
                const data = await getPublications('http://localhost:8000/v1.0/api/publications', {});
                setPublications(data.publications); // Asegúrate de que data.publications sea un array
            } catch (error) {
                console.error('Error fetching publications:', error);
            }
        };

        fetchPublications();
    }, []);

    const renderFile = (publication: Publication) => {
        if (!publication.filePath || !publication.fileType) return null;

        const fileUrl = `http://localhost:8000/${publication.filePath}`;

        if (publication.fileType.startsWith('image/')) {
            // Renderizar imagen
            return <img src={fileUrl} alt={publication.title} style={{ width: '300px', height: 'auto' }} />;
        } else if (publication.fileType.startsWith('video/')) {
            // Renderizar video
            return (
                <video controls style={{ width: '300px', height: 'auto' }}>
                    <source src={fileUrl} type={publication.fileType} />
                    Tu navegador no soporta la reproducción de video.
                </video>
            );
        } else if (publication.fileType === 'application/pdf') {
            // Enlace para visualizar PDF
            return (
                <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                    Ver PDF
                </a>
            );
        } else {
            // Enlace de descarga para otros tipos de archivo
            return (
                <a href={fileUrl} download>
                    Descargar archivo
                </a>
            );
        }
    };

    return (
        <div>
            <h1>Publicaciones</h1>
            {publications.map((publication) => (
                <div key={publication._id} style={{ marginBottom: '20px' }}>
                    <h2>{publication.title}</h2>
                    <p>{publication.content}</p>
                    <p><strong>Autor:</strong> {publication.author.username}</p>
                    <p><strong>Etiquetas:</strong> {publication.tags.join(', ')}</p>
                    {renderFile(publication)}
                </div>
            ))}
        </div>
    );
};

export default ViewPublications;

