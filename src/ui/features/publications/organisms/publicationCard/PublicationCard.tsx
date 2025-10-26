import React from 'react';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import Card from '../../../../shared/organisms/card/Card';
import CardActions from '../../../../shared/molecules/cardActions/CardActions';
import ActionMenu from '../../../../shared/molecules/actionMenu/ActionMenu'; // ← menú genérico (sin anchorEl)

import CommentDialogViewer from '../../../comments/organisms/CommentDialog/CommentDialogViewer';
import { Publication } from '../../../../../types/publication';
import { getUserId } from '../../../../../utils/auth/getUserId';
import { fetchCareers } from '../../../../../async/services/careerService'; 

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
	const [careerMap, setCareerMap] = React.useState<Record<string, string>>({});

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
		//  marcar como guardada en tu backend o estado
		console.info('Guardar publicación (TODO)');
	};

	const authorObj = publication.author as any | undefined;
  const authorStatus = (authorObj?.status ?? '').toLowerCase();
  const isAuthorMissing = !authorObj;
  const isAuthorDeleted =
    isAuthorMissing ||
    authorStatus === 'deleted' ||
    authorStatus === 'eliminado' ||
    authorStatus === 'deactivated' ||
    authorStatus === 'desactivado' ||
    authorStatus === 'blacklisted' ||
    authorStatus === 'bloqueado';

  // Nombre y avatar seguros
  const authorName = isAuthorDeleted
    ? 'Usuario eliminado'
    : (authorObj?.username || 'Usuario');

  const authorAvatarUrl = !isAuthorDeleted && authorObj?.profile?.profilePicture
    ? `${HOST}/${authorObj.profile.profilePicture}`
    : undefined;


	React.useEffect(() => {
		let mounted = true;
		(async () => {
			try {
				const careers = await fetchCareers(); // [{ _id, name }]
				if (!mounted) return;
				const map = Object.fromEntries(
					(careers ?? []).map((c: any) => [String(c._id), String(c.name ?? '')])
				);
				setCareerMap(map);
			} catch (e) {
				console.error('No se pudo cargar catálogo de carreras', e);
			}
		})();
		return () => { mounted = false; };
	}, []);
	const getId = (x: any) => (typeof x === 'string' ? x : x?._id);
	const getNameFromAny = (x: any) => {
		// si ya viene objeto con name
		if (x && typeof x === 'object' && x.name) return String(x.name);
		// si viene string (id), buscar en el mapa
		const id = getId(x);
		return id && careerMap[id] ? careerMap[id] : undefined;
	};

	const getCareerNames = (p: any): string[] => {
		const out: string[] = [];

		// 1) Carrera de la publicación (string id u objeto)
		if (p?.career) {
			const n = getNameFromAny(p.career);
			if (n) out.push(n);
			else if (typeof p.career === 'string') out.push(p.career); // fallback: muestra id si no hay nombre
		}
		if (typeof p?.careerName === 'string' && p.careerName.trim()) {
			out.push(p.careerName.trim());
		}

		// 2) Carreras en el autor (varias formas)
		const a = p?.author ?? {};
		const arrays = [a?.careers, a?.profile?.careers].filter(Boolean);
		for (const arr of arrays) {
			if (Array.isArray(arr)) {
				for (const item of arr) {
					const n = getNameFromAny(item);
					if (n) out.push(n);
					else if (typeof item === 'string') out.push(item); // fallback id
				}
			}
		}

		// 3) Objetos sueltos
		if (a?.career) {
			const n = getNameFromAny(a.career);
			if (n) out.push(n);
		}
		if (a?.profile?.career) {
			const n = getNameFromAny(a.profile.career);
			if (n) out.push(n);
		}

		// únicos y limpios
		return Array.from(new Set(out.filter(Boolean)));
	};

	const authorCareerNames = React.useMemo(
		() => getCareerNames(publication),
		[publication, careerMap] 
	);

	return (
		<>
			<Card
				title={publication.title}
				description={publication.content}
				author={{
					name: authorName,
					avatarUrl: authorAvatarUrl,
				}}
				authorCareers={authorCareerNames}
				date={publication.created_at}
				tags={publication.tags ?? []}
				onTagClick={onTagClick}
				media={renderFile(publication)}
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

