// features/publications/moleculas/publicationActions/PublicationActions.tsx
import React from 'react';

import IconButton from '../../../../shared/atoms/buttons/iconButton/IconButton';
import TooltipBubble from '../../../../shared/atoms/tooltips/tooltipBubble/TooltipBubble';
import Counter from '../../../../shared/atoms/counters/Counter';
import LikeIcon from '../../../../shared/atoms/icons/LikeIcon';

import { ActionsBar } from './publicationActions.styles';
import CommentIcon from '../../../../shared/atoms/icons/CommentIcon';

interface Props {
	liked        : boolean;
	likesCount   : number;
	commentsCount?: number;
	onLike       : () => void;
	onUnlike     : () => void;
	onComments?  : () => void;
}

const PublicationActions: React.FC<Props> = ({
	liked, likesCount, commentsCount = 0,
	onLike, onUnlike, onComments,
}) => (
	<ActionsBar disableSpacing>

		<TooltipBubble content={liked ? 'Quitar Me gusta' : 'Me gusta'}>
			<IconButton
				ariaLabel={liked ? 'Quitar Me gusta' : 'Dar Me gusta'}
				colorType="success"
				onClick={liked ? onUnlike : onLike}
			>
				<LikeIcon filled={liked} />
		<Counter value={likesCount} />
			</IconButton>
		</TooltipBubble>


		<TooltipBubble content="Comentarios">
			<IconButton
				ariaLabel="Ver comentarios"
				colorType="success"
				onClick={onComments}
			>
				<CommentIcon />
		<Counter value={commentsCount} />
			</IconButton>
		</TooltipBubble>


	</ActionsBar>
);

export default PublicationActions;

