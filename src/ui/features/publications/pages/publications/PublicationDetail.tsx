// src/ui/components/publications/PublicationDetail.tsx
import React, { useEffect, useState } from 'react';
import { useParams }               from 'react-router-dom';

import {
	fetchPublicationById               // ← mismo helper del feed
}                                   from '../../../../../async/services/publicationService';
import getEnvVariables              from '../../../../../config/configEnvs';
import { Publication } from '../../../../../types/publication';
import PublicationHeader from '../../moleculas/publicationHeader/PublicationHeader';


const PublicationDetail: React.FC = () => {
	const { publicationId } = useParams<{ publicationId:string }>();
	const [publication, setPublication] = useState<Publication|null>(null);

	const { HOST } = getEnvVariables();

	const currentUrl = `${window.location.origin}/publications/${publicationId}`;

	/* ------------ cargar la publicación ------------ */
	useEffect(() => {
		if (!publicationId) return;

		fetchPublicationById(publicationId)
		.then(setPublication)
		.catch(console.error);
	}, [publicationId]);
	if (!publication) return <p>Cargando publicación…</p>;

	/* ------------ helper archivo adjunto ------------ */
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

const handleShare = () => `${window.location.origin}/publications/${publicationId}`;

	/* ------------ UI ------------ */
	return (
		<div>
			<h2>{publication.title}</h2>
			<p>{publication.content}</p>

			<p>
				<strong>Autor:</strong> {publication.author.username ?? 'Usuario eliminado'}
			</p>

			{renderFile()}

			{/* comentarios reutilizando CommentSection */}
			<PublicationHeader
				HOST={HOST}
				title={publication.title}
				author={publication.author}
				publishedAt={publication.created_at}
				onAuthor={(id, user) => console.log(id, user)}
				onReport={() => console.log('report')}
				onShare={handleShare}
			/>
		</div>
	);
};

export default PublicationDetail;

