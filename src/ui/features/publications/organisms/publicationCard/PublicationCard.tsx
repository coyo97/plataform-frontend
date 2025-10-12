import React from 'react';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import Card from '../../../../shared/organisms/card/Card';
import CardActions from '../../../../shared/molecules/cardActions/CardActions';
import ActionMenu from '../../../../shared/molecules/actionMenu/ActionMenu'; // ← menú genérico (sin anchorEl)

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
	onTagClick?: (tag: string) => void;

	/** opcionales */
	onEdit?: (p: Publication) => void;
	onDelete?: (p: Publication) => void;
}

const PublicationCard: React.FC<Props> = ({
	HOST,
	publication,
	renderFile,
	onLike,
	onUnlike,
	onAuthor,
	onReport,
	onTagClick,
	onEdit,
	onDelete,
}) => {
	const uid = getUserId();
	const isOwner = publication.author?._id === uid;
	const liked = (publication.likes ?? []).includes(uid);

	const [showComments, setShowComments] = React.useState(false);

	// Estado del menú "⋮"
	const [menuOpen, setMenuOpen] = React.useState(false);
	const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

	const openMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(e.currentTarget);
		setMenuOpen(true);
	};
	const closeMenu = () => {
		setMenuOpen(false);
		setAnchorEl(null);
	};

	// Callbacks de acciones del menú (con fallback seguro)

	const handleEdit = () => {
		closeMenu();                 // cierra antes
		onEdit?.(publication);
	};

	const handleDelete = () => {
		closeMenu();                 // cierra antes
		onDelete?.(publication);
	};
	const handleSave = () => {
		// TODO: marcar como guardada en tu backend o estado
		console.info('Guardar publicación (TODO)');
	};

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
								subtitle: 'Autor',
						}
						: undefined
				}
				date={publication.created_at}
				tags={publication.tags ?? []}
				onTagClick={onTagClick}
				media={renderFile(publication)}
				/* ===== Header actions: aquí va el “⋮” ===== */
				headerActions={
					<>
						<IconButton
							aria-label="Más opciones de publicación"
							onClick={openMenu}
							size="small"
						>
							<MoreVertIcon />
						</IconButton>

						{menuOpen && (
							<ActionMenu
								/* SIN anchorEl: igual que tu ShareMenu */
								isOwner={isOwner}
								link={`${window.location.origin}/publications/${publication._id}`}
								onEdit={handleEdit}
								onDelete={handleDelete}
								onReport={() => onReport(publication._id)}
								onSave={handleSave}
								onClose={closeMenu}
							/>
						)}
					</>
				}
				/* ===== Footer social ===== */
				actions={
					<CardActions
						liked={liked}
						likesCount={(publication.likes ?? []).length}
						commentsCount={publication.commentsCount ?? 0}
						onLike={() => onLike(publication._id)}
						onUnlike={() => onUnlike(publication._id)}
						onComments={() => setShowComments(true)}
						onShare={() => `${window.location.origin}/publications/${publication._id}`}
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

