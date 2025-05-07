// ui/organisms/PublicationCard/PublicationCard.tsx
import React from 'react';
import { TagChip } from '../../publicationsFeed.styles';
import PublicationHeader from '../../moleculas/publicationHeader/PublicationHeader';
import PublicationActions from '../../moleculas/publicationActions/PublicationActions';
import CommentSection from '../../../comments/CommentSection';
import { CardRoot, Content } from './publicationCard.styles';

/* Types reutilizados ------------------------------------ */
export interface Publication {
	_id:string; title:string; content:string;
	tags?:string[];
	author:{
		_id:string; username:string;
		profile?:{profilePicture?:string};
	};
	filePath?:string; fileType?:string;
	likes?:string[];
}

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
	const uid    = localStorage.getItem('userId')||'';
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
				{(publication.tags??[]).map(t=>(
					<TagChip key={t} label={`#${t}`} size="small" variant="outlined"/>
				))}
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

export default PublicationCard;

