import React, { useEffect, useState } from 'react';
import { getPublications } from '../../../../async/services/publicationService';

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

const ViewUserPublications: React.FC = () => {
    const [publications, setPublications] = useState<Publication[]>([]);

    useEffect(() => {
        const fetchUserPublications = async () => {
            try {
                // Llama al endpoint que obtiene las publicaciones del usuario autenticado
                const data = await getPublications('http://localhost:8000/v1.0/api/user-publications', {});
                setPublications(data.publications); // Asegúrate de que data.publications sea un array
            } catch (error) {
                console.error('Error fetching user publications:', error);
            }
        };

        fetchUserPublications();
    }, []);

    const renderFile = (publication: Publication) => {
        if (!publication.filePath || !publication.fileType) return null;

        const fileUrl = `http://localhost:8000/${publication.filePath}`;

        if (publication.fileType.startsWith('image/')) {
            return <img src={fileUrl} alt={publication.title} style={{ width: '300px', height: 'auto' }} />;
        } else if (publication.fileType.startsWith('video/')) {
            return (
                <video controls style={{ width: '300px', height: 'auto' }}>
                    <source src={fileUrl} type={publication.fileType} />
                    Tu navegador no soporta la reproducción de video.
                </video>
            );
        } else if (publication.fileType === 'application/pdf') {
            return (
                <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                    Ver PDF
                </a>
            );
        } else {
            return (
                <a href={fileUrl} download>
                    Descargar archivo
                </a>
            );
        }
    };

    return (
        <div>
            <h1>Mis Publicaciones</h1>
            {publications.map((publication) => (
                <div key={publication._id} style={{ marginBottom: '20px' }}>
                    <h2>{publication.title}</h2>
                    <p>{publication.content}</p>
                    <p><strong>Etiquetas:</strong> {publication.tags.join(', ')}</p>
                    {renderFile(publication)}
                </div>
            ))}
        </div>
    );
};

export default ViewUserPublications;

