// src/ui/components/publications/PublicationDetail.tsx
import React, { useEffect, useState } from 'react';
import { useParams }               from 'react-router-dom';

import {
	fetchPublications,               // ← mismo helper del feed
	Publication
}                                   from '../../../async/services/publicationService';
import * as R                       from '../../../async/routes/publicationRoutes';
import getEnvVariables              from '../../../config/configEnvs';
import CommentSection               from '../comments/CommentSection';

const PublicationDetail: React.FC = () => {
	const { publicationId } = useParams<{ publicationId:string }>();
	const [publication, setPublication] = useState<Publication|null>(null);
	const { HOST } = getEnvVariables();

	//cargar la publicación 
	useEffect(() => {
		if (!publicationId) return;
		fetchPublications(R.PUB_BY_ID(publicationId))
		.then(pubs => {
			// la API devuelve { publication: … } → service lo envuelve como array
			setPublication(
				Array.isArray(pubs) ? pubs[0] : (pubs as unknown as Publication)   // fallback defensivo
			);
		})
		.catch(console.error);
	}, [publicationId]);

	if (!publication) return <p>Cargando publicación…</p>;

	const renderFile = () => {
		if (!publication.filePath || !publication.fileType) return null;
		const url = `${HOST}/${publication.filePath}`;

		if (publication.fileType.startsWith('image/'))
			return <img src={url} alt={publication.title} style={{width:300, height:'auto'}}/>;
		if (publication.fileType.startsWith('video/'))
			return (
				<video controls style={{width:300}}>
					<source src={url} type={publication.fileType}/>
				</video>
			);
			if (publication.fileType === 'application/pdf')
				return <a href={url} target="_blank" rel="noreferrer">Ver PDF</a>;

			return <a href={url} download>Descargar archivo</a>;
	};

	return (
		<div>
			<h2>{publication.title}</h2>
			<p>{publication.content}</p>

			<p>
				<strong>Autor:</strong> {publication.author.username ?? 'Usuario eliminado'}
			</p>

			{renderFile()}

			{/* comentarios reutilizando CommentSection */}
			<CommentSection publicationId={publication._id}/>
		</div>
	);
};

export default PublicationDetail;

