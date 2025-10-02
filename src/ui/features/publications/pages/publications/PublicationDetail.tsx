import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { fetchPublicationById } from '../../../../../async/services/publicationService';
import getEnvVariables from '../../../../../config/configEnvs';

import type { Publication } from '../../../../../types/publication';

import Card from '../../../../shared/organisms/card/Card';
import CardActions from '../../../../shared/molecules/cardActions/CardActions';
import CommentDialogViewer from '../.././../comments/organisms/CommentDialog/CommentDialogViewer';

const PublicationDetail: React.FC = () => {
	const { publicationId } = useParams<{ publicationId: string }>();
	const [publication, setPublication] = useState<Publication | null>(null);
	const [showComments, setShowComments] = useState(false);

	const { HOST } = getEnvVariables();

	/* ------------ cargar la publicación ------------ */
	useEffect(() => {
		if (!publicationId) return;

		fetchPublicationById(publicationId)
		.then(setPublication)
		.catch(console.error);
	}, [publicationId]);

	if (!publication) return <p>Cargando publicación…</p>;

	/* ------------ adjuntos ------------ */
	const renderFile = () => {
		if (!publication.filePath || !publication.fileType) return null;
		const url = `${HOST}/${publication.filePath}`;

		if (publication.fileType.startsWith('image/'))
			return <img src={url} alt={publication.title} style={{ maxWidth: '100%', borderRadius: 8 }} />;
		if (publication.fileType.startsWith('video/'))
			return (
				<video controls style={{ width: '100%', borderRadius: 8 }}>
					<source src={url} type={publication.fileType} />
				</video>
			);
			if (publication.fileType === 'application/pdf')
				return (
					<a href={url} target="_blank" rel="noreferrer">
						📄 Ver PDF
					</a>
				);

				return (
					<a href={url} download>
						📎 Descargar archivo
					</a>
				);
	};

	const handleShare = () => `${window.location.origin}/publications/${publicationId}`;

	/* ------------ UI ------------ */
	return (
		<>
			<Card
				title={publication.title}
				description={publication.content}
				author={
					publication.author
						? {
							name: publication.author.username,
							avatarUrl: publication.author.profile?.profilePicture
								? `${HOST}/${publication.author.profile.profilePicture}`
								: undefined,
						}
						: undefined
				}
				date={publication.created_at}
				tags={publication.tags ?? []}
				media={renderFile()}
				actions={
					<CardActions
						liked={(publication.likes ?? []).includes(publication.author?._id ?? '')}
						likesCount={(publication.likes ?? []).length}
						commentsCount={publication.commentsCount ?? 0}
						onLike={() => console.log('like', publication._id)}
						onUnlike={() => console.log('unlike', publication._id)}
						onComments={() => setShowComments(true)}
						onShare={handleShare}
						onReport={() => console.log('report', publication._id)}
					/>
				}
			/>

			{/* Diálogo de comentarios */}
			<CommentDialogViewer
				open={showComments}
				publicationId={publication._id}
				onClose={() => setShowComments(false)}
			/>
		</>
	);
};

export default PublicationDetail;

