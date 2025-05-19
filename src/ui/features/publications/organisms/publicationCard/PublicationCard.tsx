// ui/organisms/PublicationCard/PublicationCard.tsx
import React from 'react';
import { TagChip } from '../../publicationsFeed.styles';
import PublicationHeader from '../../moleculas/publicationHeader/PublicationHeader';
import PublicationActions from '../../moleculas/publicationActions/PublicationActions';
import CommentSection from '../../../comments/CommentSection';
import CommentList from '../../../comments/organisms/CommentList/CommentList';
import { CardRoot, Content } from './publicationCard.styles';
import { Publication } from '../../../../../types/publication';
import { getUserId } from '../../../../../utils/auth/getUserId';
import {Box} from '@mui/system';
import CommentDialogViewer from '../../../comments/organisms/CommentDialog/CommentDialogViewer';
import { Button } from '@mui/material';
import Badge from '../../../../shared/atoms/badges/Badge';
import TooltipBubble from '../../../../shared/atoms/tooltips/tooltipBubble/TooltipBubble';


interface Props{
	HOST        : string;
	publication : Publication;
	publishedAt: string | Date; // ✅ Aquí estaba mal tipado
	renderFile  : (p:Publication)=>React.ReactNode;
	onLike      : (id:string)=>void;
	onUnlike    : (id:string)=>void;
	onAuthor    : (id:string,user:string)=>void;
	onReport    : (id:string)=>void;
}

const PublicationCard:React.FC<Props>=({
	HOST, publication, renderFile,
	onLike,onUnlike,onAuthor,onReport, publishedAt
})=>{
	const uid = getUserId();
	const liked  = (publication.likes??[]).includes(uid);
	const [showComments, setShowComments] = React.useState(false);


	return(
		<CardRoot>
			<PublicationHeader
				HOST={HOST}
				title={publication.title}
				author={publication.author}
				onAuthor={(id,u)=>onAuthor(id,u)}
				onReport={()=>onReport(publication._id)}
				publishedAt={publication.created_at}
			/>

			<Content>
				{publication.content}
				<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
					{(publication.tags ?? []).map((tag) => (

						<TooltipBubble
							key={tag}
							content={`Material relacionado con #${tag}`}
							position="top"
							variant="dark"
							size="small"
							showArrow
						>
							<Badge
								variant="soft"
								color="primary" // Aquí también puedes mapear dinámicamente según el tag si quieres
								size="sm"
							>
								#{tag}
							</Badge>
						</TooltipBubble>
					))}
				</Box>
				{renderFile(publication)}
			</Content>

			<PublicationActions
				liked={liked}
				likesCount={(publication.likes??[]).length}
				onLike ={()=>onLike(publication._id)}
				onUnlike={()=>onUnlike(publication._id)}
			/>


			<Button size="small" onClick={() => setShowComments(true)}>
				Ver comentarios
			</Button>

			<CommentDialogViewer
				open={showComments}
				publicationId={publication._id}
				onClose={() => setShowComments(false)}
			/>
		</CardRoot>
	);
};

export default React.memo(PublicationCard);

