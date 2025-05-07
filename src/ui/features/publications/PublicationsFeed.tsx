// src/ui/components/publications/PublicationsFeed.tsx
import React from 'react';
import {
	IconButton,
	Typography,
	Tooltip,
	Avatar,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CommentIcon from '@mui/icons-material/Comment';
import ReportOutlinedIcon from '@mui/icons-material/ReportOutlined';
import SearchBar from './SearchBar';
import CommentSection from '../comments/CommentSection';

import {
	FeedWrapper,
	PostCard,
	PostHeader,
	PostContent,
	PostActions,
	TagChip,
} from './publicationsFeed.styles';

interface Publication {
	_id: string;
	title: string;
	content: string;
	tags?: string[];                  // ← puede venir undefined
	author: {
		_id: string;
		username: string;
		profile?: { profilePicture?: string };
	};
	filePath?: string;
	fileType?: string;
	likes?: string[];                 // ← puede venir undefined
}

interface Props {
	HOST: string;
	publications: Publication[];
	lastPublicationElementRef: (node: HTMLDivElement) => void;
	renderFile: (publication: Publication) => React.ReactNode;
	handleLike: (publicationId: string) => void;
	handleUnlike: (publicationId: string) => void;
	handleAuthorClick: (authorId: string, authorUsername: string) => void;
	handleOpenReportDialog: (publicationId: string) => void;
	handleSearch: (searchQuery: string) => void;
}

const PublicationsFeed: React.FC<Props> = ({
	HOST,
	publications,
	lastPublicationElementRef,
	renderFile,
	handleLike,
	handleUnlike,
	handleAuthorClick,
	handleOpenReportDialog,
	handleSearch,
}) => (
	<FeedWrapper>
		<SearchBar onSearch={handleSearch} />

		{publications.map((p, idx) => {
			const uid   = localStorage.getItem('userId') || '';
			/* ───── cambio #1 – likes seguros ───── */
			const liked = (p.likes ?? []).includes(uid);
			const hasAuthor = !!p.author?.username;

			return (
				<div
					key={p._id}
					ref={idx === publications.length - 1 ? lastPublicationElementRef : null}
				>
					<PostCard>
						{/* Header */}
						<PostHeader
							avatar={
								hasAuthor ? (
									<Avatar
										src={
											p.author.profile?.profilePicture
												? `${HOST}/${p.author.profile.profilePicture}`
												: undefined
										}
										alt={p.author.username}
										sx={{ cursor: 'pointer' }}
										onClick={() => handleAuthorClick(p.author._id, p.author.username)}
									/>
							) : (
								<Avatar>?</Avatar>
							)
							}
							title={p.title}
							subheader={
								hasAuthor ? `Publicado por ${p.author.username}` : 'Usuario eliminado'
							}
							action={
								<Tooltip title="Reportar contenido">
									<IconButton onClick={() => handleOpenReportDialog(p._id)}>
										<ReportOutlinedIcon color="error" />
									</IconButton>
								</Tooltip>
							}
						/>

						{/* Content */}
						<PostContent>
							<Typography variant="body2">{p.content}</Typography>
							{/* ───── cambio #2 – tags seguros ───── */}
							{(p.tags ?? []).map((t) => (
								<TagChip key={t} label={`#${t}`} size="small" variant="outlined" />
							))}
							{renderFile(p)}
						</PostContent>

						{/* Actions */}
						<PostActions disableSpacing>
							<Tooltip title={liked ? 'Quitar Me gusta' : 'Me gusta'}>
								<IconButton
									onClick={() => (liked ? handleUnlike(p._id) : handleLike(p._id))}
								>
									{liked ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
								</IconButton>
							</Tooltip>
							<Typography variant="body2">
								{(p.likes ?? []).length}
							</Typography>
							<Tooltip title="Comentarios">
								<IconButton>
									<CommentIcon />
								</IconButton>
							</Tooltip>
						</PostActions>

						{/* Comments */}
						<CommentSection publicationId={p._id} />
					</PostCard>
				</div>
			);
		})}
	</FeedWrapper>
);

export default PublicationsFeed;

