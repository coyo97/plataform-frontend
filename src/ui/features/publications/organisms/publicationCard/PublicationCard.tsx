// ui/organisms/PublicationCard/PublicationCard.tsx
import React from 'react';
import { TagChip } from '../../publicationsFeed.styles';
import PublicationHeader from '../../moleculas/publicationHeader/PublicationHeader';
import PublicationActions from '../../moleculas/publicationActions/PublicationActions';
import CommentSection from '../../../comments/CommentSection';
import { CardRoot, Content } from './publicationCard.styles';
import { Publication } from '../../../../../types/publication';
import { getUserId } from '../../../../../utils/auth/getUserId';
import {Box} from '@mui/system';


interface Props{
	HOST        : string;
	publication : Publication;
	renderFile  : (p:Publication)=>React.ReactNode;
	onLike      : (id:string)=>void;
	onUnlike    : (id:string)=>void;
	onAuthor    : (id:string,user:string)=>void;
	onReport    : (id:string)=>void;
}

const PublicationCard:React.FC<Props>=({
	HOST, publication, renderFile,
	onLike,onUnlike,onAuthor,onReport,
})=>{
	const uid = getUserId();
	const liked  = (publication.likes??[]).includes(uid);

	return(
		<CardRoot>
			<PublicationHeader
				HOST={HOST}
				title={publication.title}
				author={publication.author}
				onAuthor={(id,u)=>onAuthor(id,u)}
				onReport={()=>onReport(publication._id)}
			/>

			<Content>
				{publication.content}
				<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
				{(publication.tags??[]).map(t=>(
					<TagChip key={t} label={`#${t}`} size="small" variant="outlined"/>
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

			<CommentSection publicationId={publication._id}/>
		</CardRoot>
	);
};

export default React.memo(PublicationCard);

