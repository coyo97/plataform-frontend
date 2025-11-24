// src/ui/features/publications/organisms/publicationsFeed/PublicationsFeed.tsx
import React from 'react';
import SearchInput from '../../../../shared/molecules/searchInput';
import PublicationCard from '../publicationCard/PublicationCard';
import { FeedWrapper }  from './publicationsFeed.styles';
import { Publication } from '../../../../../types/publication';

interface Props{
	HOST : string;
	list : Publication[];
	lastRef:(n:HTMLDivElement)=>void;
	renderFile : (p:Publication)=>React.ReactNode;
	onLike     : (id:string)=>void;
	onUnlike   : (id:string)=>void;
	onAuthor   : (id:string,user:string)=>void;
	onReport   : (id:string)=>void;
	onSearch   : (q:string)=>void;
	onTagClick?: (tag:string)=>void;

	onEditRequested?: (p: Publication) => void;
	onDeleted?: (p: Publication) => void;
	  canEditPublication?: boolean;
  canDeletePublication?: boolean;
}

const PublicationsFeed:React.FC<Props>=({
	HOST,list,lastRef,renderFile,onLike,onUnlike,onAuthor,onReport,onSearch,onTagClick,
	onEditRequested, onDeleted,   canEditPublication,
  canDeletePublication,
})=>(
	<FeedWrapper>
		<div style={{ position: 'sticky', top: 0, background: 'white' }}>
			<SearchInput onSearch={onSearch} />
		</div>
		{list.map((p,idx)=>(
			<div key={p._id} ref={idx===list.length-1?lastRef:null} role='article'>
				<PublicationCard
					HOST={HOST}
					publication={p}
					publishedAt={p.created_at}
					renderFile={renderFile}
					onLike={onLike}
					onUnlike={onUnlike}
					onAuthor={onAuthor}
					onReport={onReport}
					onTagClick={onTagClick}
					onEdit={onEditRequested}
					onDelete={onDeleted}
					      canEditPublication={canEditPublication}
          canDeletePublication={canDeletePublication}
				/>
			</div>
		))}
	</FeedWrapper>
);

export default PublicationsFeed;

