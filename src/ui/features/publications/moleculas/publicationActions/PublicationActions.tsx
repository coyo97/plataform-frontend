// ui/molecules/PublicationActions/PublicationActions.tsx
import React from 'react';
import {  Tooltip, Typography } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CommentIcon from '@mui/icons-material/Comment';
import { ActionsBar } from './publicationActions.styles';
import IconButton from '../../../../shared/atoms/buttons/iconButton/IconButton';

interface Props{
	liked      : boolean;
	likesCount : number;
	onLike     : ()=>void;
	onUnlike   : ()=>void;
}

const PublicationActions:React.FC<Props>=({liked,likesCount,onLike,onUnlike})=>(
	<ActionsBar disableSpacing>
		<Tooltip title={liked ? 'Quitar Me gusta' : 'Me gusta'}>
			<IconButton
				onClick={liked ? onUnlike : onLike}
				ariaLabel={liked ? 'Quitar Me gusta' : 'Dar Me gusta'}
				colorType='secondary'
			>
				{liked ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
			</IconButton>
		</Tooltip>

		<Typography variant="body2">{likesCount}</Typography>

		<Tooltip title="Comentarios">
			<IconButton ariaLabel="Abrir comentarios"><CommentIcon/></IconButton>
		</Tooltip>
	</ActionsBar>
);

export default PublicationActions;

