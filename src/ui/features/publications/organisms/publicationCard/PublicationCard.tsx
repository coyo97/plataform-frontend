// features/publications/organisms/publicationCard/PublicationCard.tsx
import React from 'react';

import PublicationHeader  from '../../moleculas/publicationHeader/PublicationHeader';
import PublicationActions from '../../moleculas/publicationActions/PublicationActions';

import SmartBox from '../../../../shared/atoms/box/SmartBox';
import Badge from '../../../../shared/atoms/badges/Badge';
import TooltipBubble from '../../../../shared/atoms/tooltips/tooltipBubble/TooltipBubble';
import FilledButton from '../../../../shared/atoms/buttons/filledButton/FilledButton';

import CommentDialogViewer from '../../../comments/organisms/CommentDialog/CommentDialogViewer';

import { CardRoot, Content } from './publicationCard.styles';
import { Publication } from '../../../../../types/publication';
import { getUserId } from '../../../../../utils/auth/getUserId';

interface Props {
	HOST        : string;
	publication : Publication;
	publishedAt : string | Date;
	renderFile  : (p: Publication) => React.ReactNode;
	onLike      : (id: string) => void;
	onUnlike    : (id: string) => void;
	onAuthor    : (id: string, user: string) => void;
	onReport    : (id: string) => void;
}

const PublicationCard: React.FC<Props> = ({
	HOST, publication, renderFile,
	onLike, onUnlike, onAuthor, onReport,
}) => {
	const uid    = getUserId();
	const liked  = (publication.likes ?? []).includes(uid);
	const [showComments, setShowComments] = React.useState(false);

	return (
		<CardRoot>

			<PublicationHeader
				HOST={HOST}
				title={publication.title}
				author={publication.author}
				onAuthor={onAuthor}
				onReport={() => onReport(publication._id)}
				publishedAt={publication.created_at}
			/>

			<Content>
				{publication.content}

				{/* etiquetas */}
				<SmartBox row flexWrap="wrap" gap="px8" mt="px8"> 
					{(publication.tags ?? []).map(tag => (
						<TooltipBubble
							key={tag}
							content={`Material relacionado con #${tag}`}
							position="top"
							variant="dark"
							size="small"
							showArrow
						>
							<Badge variant="soft" color="primary" size="sm">
								#{tag}
							</Badge>
						</TooltipBubble>
					))}
				</SmartBox>

				{renderFile(publication)}
			</Content>

			<PublicationActions
				liked={liked}
				likesCount={(publication.likes ?? []).length}
				commentsCount={publication.commentsCount ?? 0}
				onLike={() => onLike(publication._id)}
				onUnlike={() => onUnlike(publication._id)}
				onComments={() => setShowComments(true)}       
			/>

			<CommentDialogViewer
				open={showComments}
				publicationId={publication._id}
				onClose={() => setShowComments(false)}
			/>
		</CardRoot>
	);
};

export default React.memo(PublicationCard);

