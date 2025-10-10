import React, { useEffect, useRef } from 'react';
import { CardActionsProps } from './cardActions.types';
import { ActionsWrapper } from './cardActions.styles';

import IconButton from '../../atoms/buttons/iconButton/IconButton';
import Text from '../../atoms/typography/Text';
import ShareMenu from '../shareMenu/ShareMenu';
import TooltipBubble from '../../atoms/tooltips/tooltipBubble/TooltipBubble';

import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ShareIcon from '@mui/icons-material/Share';
import ReportOutlinedIcon from '@mui/icons-material/ReportOutlined';

const CardActions: React.FC<CardActionsProps> = ({
	liked,
	likesCount = 0,
	commentsCount = 0,
	showLike = true,
	showComment = true,
	showShare = true,
	showReport = true,
	onLike,
	onUnlike,
	onComments,
	onShare, // opcional, puede usarse para customizar el link
	onReport,
}) => {
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

	const ariaLiveRef = useRef<HTMLSpanElement>(null);
	useEffect(() => {
		if (!ariaLiveRef.current) return;
		ariaLiveRef.current.textContent = `Me gusta: ${likesCount}. Comentarios: ${commentsCount}.`;
	}, [likesCount, commentsCount]);

	const handleOpenShare = (e: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(e.currentTarget);
	};

	const handleCloseShare = () => {
		setAnchorEl(null);
	};

	const shareLink = onShare ? onShare() : window.location.href;

	return (
		<ActionsWrapper role="group" aria-label="Acciones de la publicación">
			{showLike && (
				<>
					<TooltipBubble title={liked ? 'Quitar Me gusta' : 'Me gusta'} placement="top" size="small" maxWidth={160}>
						<IconButton
							ariaLabel={liked ? 'Quitar me gusta' : 'Dar me gusta'}
							onClick={liked ? onUnlike : onLike}
							onKeyDown={(e: React.KeyboardEvent) => {
								if (e.key === 'Enter' || e.key === ' ') (liked ? onUnlike : onLike)?.();
							}}
						>
							{liked ? <ThumbUpIcon /> : <ThumbUpOffAltIcon />}
						</IconButton>
					</TooltipBubble>


					{/* Re-montamos el nodo para animar el número sin cambiar props */}
					<Text size="sm" className="counter-anim" key={`likes-${likesCount}`} aria-hidden>
						{likesCount}
					</Text>
				</>
			)}

			{showComment && (
				<>
					<TooltipBubble title="Comentarios" placement="top" size="small" maxWidth={160}>
						<IconButton
							ariaLabel="Comentar"
							onClick={onComments}
							onKeyDown={(e: React.KeyboardEvent) => {
								if (e.key === 'Enter' || e.key === ' ') onComments?.();
							}}
						>
							<ChatBubbleOutlineIcon />
						</IconButton>
					</TooltipBubble>

					<Text size="sm" className="counter-anim" key={`comments-${commentsCount}`} aria-hidden>
						{commentsCount}
					</Text>
				</>
			)}

			{showShare && (
				<>

					<TooltipBubble title="Compartir" placement="top" size="small" maxWidth={160}>
						<IconButton ariaLabel="Compartir" onClick={handleOpenShare}>
							<ShareIcon />
						</IconButton>
					</TooltipBubble>

					{open && anchorEl && <ShareMenu link={shareLink} onClose={handleCloseShare} />}
				</>
			)}

			{showReport && (
				<TooltipBubble title="Reportar" placement="top" size="small" maxWidth={160}>
					<IconButton ariaLabel="Reportar" onClick={onReport}>
						<ReportOutlinedIcon />
					</IconButton>
				</TooltipBubble>

			)}

			{/* Sólo lectores de pantalla */}
			<span ref={ariaLiveRef} aria-live="polite" className="sr-only" />
		</ActionsWrapper>
	);
};

export default React.memo(CardActions);

