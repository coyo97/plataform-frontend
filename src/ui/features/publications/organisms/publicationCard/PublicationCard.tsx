import React from 'react';
import Card from '../../../../shared/organisms/card/Card';
import CardActions from '../../../../shared/molecules/cardActions/CardActions';

import CommentDialogViewer from '../../../comments/organisms/CommentDialog/CommentDialogViewer';
import { Publication } from '../../../../../types/publication';
import { getUserId } from '../../../../../utils/auth/getUserId';

interface Props {
	HOST: string;
	publication: Publication;
	publishedAt: string | Date;
	renderFile: (p: Publication) => React.ReactNode;
	onLike: (id: string) => void;
	onUnlike: (id: string) => void;
	onAuthor: (id: string, user: string) => void;
	onReport: (id: string) => void;
}

const PublicationCard: React.FC<Props> = ({
	HOST,
	publication,
	renderFile,
	onLike,
	onUnlike,
	onAuthor,
	onReport,
}) => {
	const uid = getUserId();
	const liked = (publication.likes ?? []).includes(uid);
	const [showComments, setShowComments] = React.useState(false);

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
								subtitle: 'Autor', // opcional, podrías usar rol o facultad si la tienes
						}
						: undefined
				}
				date={publication.created_at}
				tags={publication.tags ?? []}
				media={renderFile(publication)}
				actions={
					<CardActions
						liked={liked}
						likesCount={(publication.likes ?? []).length}
						commentsCount={publication.commentsCount ?? 0}
						onLike={() => onLike(publication._id)}
						onUnlike={() => onUnlike(publication._id)}
						onComments={() => setShowComments(true)}
						onShare={() =>
							`${window.location.origin}/publications/${publication._id}`
						}
						onReport={() => onReport(publication._id)}
					/>
				}
				onClickAuthor={() =>
					publication.author &&
					onAuthor(publication.author._id, publication.author.username)
				}
			/>

			<CommentDialogViewer
				open={showComments}
				publicationId={publication._id}
				onClose={() => setShowComments(false)}
			/>
		</>
	);
};

export default React.memo(PublicationCard);

