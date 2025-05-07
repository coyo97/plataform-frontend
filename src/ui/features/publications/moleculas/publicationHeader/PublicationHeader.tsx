// ui/molecules/PublicationHeader/PublicationHeader.tsx
import React from 'react';
import { Avatar, IconButton, Tooltip } from '@mui/material';
import ReportIcon from '@mui/icons-material/ReportOutlined';
import { StyledHeader } from './publicationHeader.styles';

export interface Author {
	_id:string; username:string; profile?:{profilePicture?:string};
}
interface Props {
	HOST       : string;
	title      : string;
	author     : Author;
	onAuthor   : (id:string,user:string)=>void;
	onReport   : ()=>void;
}

const PublicationHeader:React.FC<Props> = ({ HOST,title,author,onAuthor,onReport })=> {
	const hasAuthor = !!author?.username;
	return (
		<StyledHeader
			avatar={hasAuthor
				? <Avatar
					src={author.profile?.profilePicture
						? `${HOST}/${author.profile.profilePicture}`
						: undefined}
					alt={author.username}
					sx={{cursor:'pointer'}}
					onClick={()=>onAuthor(author._id,author.username)}
				/>
				: <Avatar>?</Avatar>}
			title={title}
			subheader={hasAuthor?`Publicado por ${author.username}`:'Usuario eliminado'}
			action={
				<Tooltip title="Reportar contenido">
					<IconButton onClick={onReport}>
						<ReportIcon color="error"/>
					</IconButton>
				</Tooltip>
			}
		/>
	);
};

export default PublicationHeader;

