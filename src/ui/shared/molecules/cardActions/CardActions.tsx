import React from 'react';
import { CardActionsProps } from './cardActions.types';
import { ActionsWrapper } from './cardActions.styles';

import IconButton from '../../atoms/buttons/iconButton/IconButton';
import Text from '../../atoms/typography/Text';
import ShareMenu from '../shareMenu/ShareMenu';

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

	const handleOpenShare = (e: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(e.currentTarget);
	};

	const handleCloseShare = () => {
		setAnchorEl(null);
	};

	const shareLink = onShare ? onShare() : window.location.href;

	return (
		<ActionsWrapper>
			{showLike && (
				<>
					<IconButton
						ariaLabel={liked ? 'Quitar me gusta' : 'Dar me gusta'}
						onClick={liked ? onUnlike : onLike}
					>
						{liked ? <ThumbUpIcon /> : <ThumbUpOffAltIcon />}
					</IconButton>
					<Text size="sm">{likesCount}</Text>
				</>
			)}

			{showComment && (
				<>
					<IconButton ariaLabel="Comentar" onClick={onComments}>
						<ChatBubbleOutlineIcon />
					</IconButton>
					<Text size="sm">{commentsCount}</Text>
				</>
			)}

			{showShare && (
				<>
					<IconButton ariaLabel="Compartir" onClick={handleOpenShare}>
						<ShareIcon />
					</IconButton>
					{open && anchorEl && (
						<ShareMenu link={shareLink} onClose={handleCloseShare} />
					)}
				</>
			)}

			{showReport && (
				<IconButton ariaLabel="Reportar" onClick={onReport}>
					<ReportOutlinedIcon />
				</IconButton>
			)}
		</ActionsWrapper>
	);
};

export default React.memo(CardActions);

