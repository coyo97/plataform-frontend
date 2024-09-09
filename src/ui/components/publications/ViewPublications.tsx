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

    return (
        <div>
            <h1>Publicaciones</h1>
            {publications.map((publication) => (
                <div key={publication._id}>
                    <h2>{publication.title}</h2>
                    <p>{publication.content}</p>
                    <p><strong>Autor:</strong> {publication.author.username}</p>
                    <p><strong>Etiquetas:</strong> {publication.tags.join(', ')}</p>
                </div>
            ))}
        </div>
    );
};

export default ViewPublications;
